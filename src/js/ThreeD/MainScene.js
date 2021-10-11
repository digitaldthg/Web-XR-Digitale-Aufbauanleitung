import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import webXRScene from '../../webxrscene/src';
import vorhangSchiene from '../ThreeD/Vorhangschiene';

import SeilPoints from '../ThreeD/seilPoints';
import {AmbientLight, MeshBasicMaterial, SpotLight, Vector3} from 'three';
import HDRI from '../../textures/studio_small_08.jpg';
import ThreeMeshUI from 'three-mesh-ui';
import Text_UI from './Text_UI';

import CustomMaskMaterial from './customMaskMaterial';
import {MeshLine, MeshLineMaterial} from 'three.meshline';

import StaticContent from '../../Content/StaticContent';


class MainScene {

  constructor(store) {

    this.store = store;
    this.library = {};
    this.currentStep = -1;
    this.activeBone = null;

    /**
     * Sortiert alle Arbeitsanweisungen
     */
    var sortedSteps = Object.keys(StaticContent).sort((a, b) => {
      return StaticContent[a].Schritt - StaticContent[b].Schritt;
    }).map((keyName) => {
      return keyName;
    });

    this.steps = sortedSteps;

    /**
     * Erstellt eine neue webXRScene
     */
    this.webXRScene = new webXRScene("main-scene-canvas");
    this.webXRScene.Mixer.timeScale = .000001;

    /**
     * Setzt die Camera Position falls sich der Mode wechselt: Deskop / AR / VR
     */
    this.webXRScene.Events.addEventListener("OnChangeXRView", (mode) => {

      if (mode.xrMode != "Desktop") {
        this.webXRScene.Controls.SetPosition(-3, 1.8, 0);
      }
      if (mode.xrMode == "AR") {
        this.webXRScene.Renderer.instance.setClearColor(0x000000, 0);
      } else {
        this.webXRScene.Renderer.instance.setClearColor(0xffffff, 1);
      }
    });

    /**
     * Ambient Licht  
     */
    var ambientLight = new AmbientLight(0xaaaaaa);
    this.webXRScene.Scene.add(ambientLight);

    /**
     * Spot Licht  
     */
    var spotLight = new SpotLight(0xffffff);
    spotLight.position.set(5, 35, 0);
    spotLight.angle = 90 * Math.PI / 180;
    spotLight.target.position.set(0, 0, 0);
    spotLight.castShadow = true;
    spotLight.penumbra = 1;
    spotLight.shadow.mapSize.width = 512; // default
    spotLight.shadow.mapSize.height = 512; // default
    spotLight.shadow.camera.near = 0.1; // default
    spotLight.shadow.camera.far = 30;

    this.webXRScene.Scene.add(spotLight);

    /**
     * Setzt die Initialen Positionen  
     */
    this.webXRScene.Camera.SetPosition(2, 1.8, 1);
    this.webXRScene.Controls.SetTarget(0, 1, 0);
    this.webXRScene.Controls.Update();

    // Lädt die Environment Map
    this.webXRScene.textureLoader = new THREE.TextureLoader();
    this.envMap = this.webXRScene.textureLoader.load(HDRI);


    /**
     * Erstellt den Hinweisring
     */
    var sphereGeo = new THREE.RingGeometry(.5, .52, 32, 1);
    var sphereMat = new MeshBasicMaterial({color: new THREE.Color(0x0B499D), side: THREE.DoubleSide});

    var sphereMatOpacity = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x0B499D),
      opacity: .3,
      side: THREE.BackSide,
      depthTest: false,
      depthWrite: false

    });

    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.sphere.scale.set(0, 0, 0);
    this.webXRScene.Scene.add(this.sphere);

    this.sphereFill = new THREE.Mesh(new THREE.SphereGeometry(.52, 32, 32), sphereMatOpacity);
    this.sphereFill.scale.set(0, 0, 0);
    this.sphereFill.visible = false;
    this.webXRScene.Scene.add(this.sphereFill);

    // Billboard für den Anweisungsring
    this.webXRScene.Events.addEventListener("OnAnimationLoop", () => {
      this.sphere.lookAt(this.webXRScene.Controls.GetCameraPosition());
      this.SetContentPosition();
    });


    /**
     * Unsichtbarer Floor
     */


    var planeMaterial = new THREE.ShadowMaterial({transparent: false});
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 32, 32), planeMaterial);
    this.floor.receiveShadow = true;
    this.floor.rotation.x = -90 * Math.PI / 180;
    this.webXRScene.Scene.add(this.floor);

    /**
     * Erstellt das Seil für die Vorhangschiene
     * anhand der SeilPoints (src>ThreeD>seilPoints.js)
     */
    let points = []
    SeilPoints.forEach((sP) => {
      points.push(new THREE.Vector3(sP.x, sP.y, sP.z));
    });
    const line = new MeshLine();
    line.setPoints(points);
    this.meshLineMaterial = new MeshLineMaterial({
      lineWidth: .006,
      color: 0x333333,
      dashRatio: .5,
      depthWrite: true,
      depthTest: false,
      alphaTest: 0,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.meshLine = new THREE.Mesh(line, this.meshLineMaterial);
    this.meshLine.position.y = 1;
    this.webXRScene.Scene.add(this.meshLine);
    this.webXRScene.Events.addEventListener("OnAnimationLoop", () => {
      this.meshLineMaterial.dashOffset -= .00001;
    });

    /* Text */
    this.textUI = new Text_UI(this);

    /**
     * Default Material für alle Modelteile
     */
    this.customMaskMaterial = new CustomMaskMaterial();
    this.webXRScene.Events.addEventListener("OnAnimationLoop", () => {
      this.customMaskMaterial.update();
    });
    this.customMaskMaterial.envMap = this.envMap;
    this.customMaskMaterial.metalness = .25;
    this.customMaskMaterial.roughness = .3;

    /**
     * Default AnimationLoop
     * Update Tween => CameraTransitions
     * ThreeMeshUI => Text
     * 
     */
    this.webXRScene.Events.addEventListener("OnAnimationLoop", () => {
      TWEEN.update();
      ThreeMeshUI.update();
      this.textUI.Update();
    });

    /**
     * Während des Ladens der Modelle wird dieser Event ausgeführt
     */
    this.webXRScene.Events.addEventListener("OnProgress", (progress) => {
      console.log(progress);
    });

    /**
     * Lädt die GLTF Modelle als stack [name: 'Name', url:'URL_GLTF']
     */
    this.webXRScene.Loader.loadStack({
      stack: vorhangSchiene,
      progress: () => {}
    }).then((library) => {

      this.library = Object.assign(this.library, library);

      Object.keys(library).map((elements) => {
        this.SetupMaterials(library[elements].scene);

        library[elements].mixer.timeScale = .1;
        this.vorhangSchiene = library[elements].scene;
        this.vorhangSchiene.position.y = 1;
        
        //Fügt die Vorhangschiene zur Scene hinzu
        this.webXRScene.Scene.add(this.vorhangSchiene);

        console.log("%c GLTF Model zur Scene hinzugefügt", "background:#4caf50;color:#fff;padding:.2rem;");
      });
      this.store.commit("SetLibrary", this.library);
    });
  }

  /**
   * Setzt das Default Material
   */
  SetupMaterials(el) {
    el.children[1].children.map((child) => {
      if (Object.prototype.hasOwnProperty.call(child, "material")) {
        child.material = this.customMaskMaterial;

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  /**
   * Setzt das Anweisungspanel zur richtigen Position (nötig in VR/AR)
   */
  SetContentPosition = () => {
    if (this.activeBone != null) {
      var position = new THREE.Vector3();
      this.activeBone.getWorldPosition(position);
      this.sphere.position.set(position.x, position.y, position.z);
      this.sphereFill.position.set(position.x, position.y, position.z);

      this.library.VorhangSchiene.scene.children[1].children.map((child) => {
        child.material.SetPosition({
          x: position.x,
          y: position.y - 1,
          z: position.z
        });

        child.material.SetRadius(2);
      });
    }
  }

  /**
   * @method StartAnimation
   * Animiert die Camera und das Target über eine Zeit von 2s
   * @param {Vector3} pos 
   * @param {Vector3} target 
   * 
   */
  StartAnimation(pos, target) {
    var startPos = this.webXRScene.Controls.GetCameraPosition();
    var startTarget = this.webXRScene.Controls.GetTarget();
    var endPos = Object.assign({}, pos);
    var endTarget = Object.assign({}, target);

    new TWEEN.Tween({pos: startPos, target: startTarget}).to({
      pos: endPos,
      target: endTarget
    }, 2000).easing(TWEEN.Easing.Quadratic.Out).onUpdate((value) => {
      this.webXRScene.Controls.SetPosition(value.pos.x, value.pos.y, value.pos.z);
      this.webXRScene.Controls.SetTarget(value.target.x, value.target.y, value.target.z);
    }).start()
  }

  /**
   * @method PlayActionByName
   * Spielt den ActionClip der GLTF ab. Name entspricht den Actions in der Blender Datei. (<- Siehe Vorhangschiene.blend)
   * @param {string} clipName 
   * @returns {object} Einzelner Anweisungsschritt
   */
  PlayActionByName = (clipName) => {
    var offset = 1;
    this.currentStep = this.steps.indexOf(clipName);

    // define some variables
    var clip = this.library.VorhangSchiene.actions[clipName];

    var maskTargetPos = {
      x: StaticContent[clipName].target_x,
      y: StaticContent[clipName].target_y,
      z: StaticContent[clipName].target_z
    };
    var maskCameraPos = {
      x: StaticContent[clipName].cam_x,
      y: StaticContent[clipName].cam_y,
      z: StaticContent[clipName].cam_z
    };
    var radius = StaticContent[clipName].radius;

    // Für den ersten und letzten Step mach das Seil sichtbar
    this.meshLine.visible = clipName == "";

    // Update Text
    this.textUI.SetHeadline(clipName + " ");
    this.textUI.SetText(StaticContent[clipName].Description);
    this.textUI.SetPosition(maskTargetPos.x, maskTargetPos.y, maskTargetPos.z);

    // sets position and target of controls
    if (this.webXRScene.Controls.GetCurrentXRMode() === "Desktop") { 
      this.StartAnimation({
        x: maskCameraPos.x,
        y: maskCameraPos.y + offset,
        z: maskCameraPos.z
      }, {
        x: maskTargetPos.x,
        y: maskTargetPos.y + offset,
        z: maskTargetPos.z
      })
      this.webXRScene.Controls.SetPosition(maskCameraPos.x, maskCameraPos.y + offset, maskCameraPos.z);
      this.webXRScene.Controls.SetTarget(maskTargetPos.x, maskTargetPos.y + offset, maskTargetPos.z);
    }

    var spherePos = Object.assign({}, maskTargetPos);

    if (StaticContent[clipName].active_bone != null) {
      var activeBoneName = StaticContent[clipName].active_bone;
      var activeBone = this.library.VorhangSchiene.scene.children[0].children.filter(b => b.name == activeBoneName);
      if (activeBone.length > 0) {
        this.activeBone = activeBone[0];
      }
    } else {
      this.activeBone = null;
    }
    this.sphere.position.set(spherePos.x, spherePos.y + offset, spherePos.z);
    this.sphereFill.position.set(spherePos.x, spherePos.y + offset, spherePos.z);

    this.sphere.scale.set(radius * 2, radius * 2, radius * 2);
    this.sphereFill.scale.set(radius * 2, radius * 2, radius * 2);

    // update actual mask material

    this.library.VorhangSchiene.scene.children[1].children.map((child) => {
      child.material.SetRadius(radius);
      child.material.SetPosition(spherePos);
    });

    // Stoppt alle laufenden Actions und spielt die gewählte Action ab
    if (Object.prototype.hasOwnProperty.call(this.library.VorhangSchiene.actions, clipName)) { // play animation
      this.library.VorhangSchiene.mixer.stopAllAction();
      this.library.VorhangSchiene.actions[clip.name].reset();
      this.library.VorhangSchiene.actions[clip.name].play();
    }

    return Object.assign({
      clipName: clipName
    }, StaticContent[clipName]);
  }

  /**
   * @method ChangeAnimationStep
   * Wechselt zum nächsten (+1) oder vorherigen (-1) Anweisungsschritt
   * @param {number} dir 1 oder -1 
   * @returns { Object } Einzelner Anweisungsschritt
   */
  ChangeAnimationStep = (dir) => {
    var nextStep = this.currentStep + dir;
    nextStep = nextStep > (this.steps.length - 1) ? 0 : nextStep;
    nextStep = nextStep < 0 ? (this.steps.length - 1) : nextStep;
    return this.PlayActionByName(this.steps[nextStep]);
  }
}

export default MainScene;
