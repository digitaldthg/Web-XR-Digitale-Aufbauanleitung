import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import {webXRScene} from '../../webxrscene';
import vorhangSchiene from '../ThreeD/Vorhangschiene';
import SeilSetup from '../ThreeD/Seil';
import SeilPoints from '../ThreeD/seilPoints';
import { AmbientLight,SpotLight } from 'three';
import HDRI from '../../textures/studio002small.png';
import Text_UI from './Text_UI';
import CustomFresnelMaterial from './customFresnelMaterial';
import CustomMaskMaterial from './customMaskMaterial';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import Common from '../Common/Common';

import MaskPositions from './MaskPositions';

class MainScene{

  constructor(store){
    this.store = store;
    this.library = {};
    this.currentStep = -1;

    var sortedSteps = Object.keys(MaskPositions).sort((a,b)=>{
      return MaskPositions[a].Schritt - MaskPositions[b].Schritt;
    }).map((keyName, index)=>{
      return keyName;
    });
    
    this.steps = sortedSteps;

    this.webXRScene = new webXRScene("main-scene-canvas");
    this.webXRScene.Events.addEventListener("OnChangeXRView",(mode)=>{
      
      if(mode.xrMode != "Desktop"){
        this.webXRScene.Controls.SetPosition(-3,1.8,0);
        console.log(this.library.VorhangSchiene);
        //this.library.VorhangSchiene.scene.position.y = 1;
      }
    });
    var ambientLight = new AmbientLight(0x0c0c0c);
    this.webXRScene.Scene.add(ambientLight);

    var spotLight = new SpotLight(0xffffff);
    spotLight.position.set(0, 15, 0);
    spotLight.angle = 30 * Math.PI / 180;
    spotLight.penumbra = 1;
    spotLight.target.position.set(0,0,0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;  // default
    spotLight.shadow.mapSize.height = 1024; // default
    spotLight.shadow.camera.near = 0.1;    // default
    spotLight.shadow.camera.far = 20;     // default
    spotLight.shadow.focus = 1;

    var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    this.webXRScene.Scene.add( spotLightHelper );
    // var helper = new THREE.CameraHelper( spotLight );
    // this.webXRScene.Scene.add( helper );


    this.webXRScene.Scene.add(spotLight);
    this.webXRScene.Camera.SetPosition(1,1.014,0);
    this.webXRScene.Controls.SetTarget(0,1,0);
    this.webXRScene.Controls.Update();

    // Load envMap.
    this.webXRScene.textureLoader = new THREE.TextureLoader();
    this.envMap = this.webXRScene.textureLoader.load(HDRI);

    
    /*** */
    var sphereGeo = new THREE.SphereGeometry(.5,32,32);
    var sphereMat = new CustomFresnelMaterial({
      color : new THREE.Color(0x8bc34a),
      opacity : .1
    });
    
    this.sphere = new THREE.Mesh(sphereGeo,sphereMat);
    this.sphere.scale.set(0,0,0);
    this.webXRScene.Scene.add(this.sphere);
    
    var planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = .4;
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(100,100,32),planeMaterial);
    this.floor.receiveShadow = true;
    this.floor.rotation.x = -90 * Math.PI / 180;
    this.webXRScene.Scene.add(this.floor);

  /* Line */
    let points  = []
    SeilPoints.forEach((sP)=>{
      points.push(new THREE.Vector3(sP.x, sP.y,sP.z));
    });
    const line = new MeshLine();
    line.setPoints(points);
    this.meshLineMaterial = new MeshLineMaterial({
      lineWidth : .006,
      color : 0x333333,
      // dashArray : .01,
      // dashOffset : .01,
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
    this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
      this.meshLineMaterial.dashOffset -= .00001;
  });

  /* Text */
    this.textUI = new Text_UI(this);
    this.customMaskMaterial = new CustomMaskMaterial();
    this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
      this.customMaskMaterial.update();
    });


    this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
      TWEEN.update();
      ThreeMeshUI.update();
      this.textUI.Update();    
    });

    this.webXRScene.Events.addEventListener("OnProgress" , (progress) =>{
      //console.log(progress);
    });
    
  // //   //load stack of objects
    this.webXRScene.Loader.loadStack({
      stack : vorhangSchiene
    }).then((library)=>{

      this.library = Object.assign(this.library,library);

      Object.keys(library).map((elements, index)=>{
        this.SetupMaterials(library[elements].scene);

        this.vorhangSchiene = library[elements].scene;
        this.vorhangSchiene.position.y = 1;
        this.vorhangSchiene.castShadow = true;
        this.vorhangSchiene.children.forEach(child => {
          if(child.type == "Mesh"|| child.type == "SkinnedMesh"){
            child.castShadow = true;
            //child.receiveShadow = true;
            if(child.children.length > 0){
              child.children.forEach((_subChild)=>{
                if(_subChild.type == "Mesh" || _subChild.type == "SkinnedMesh"){
                  _subChild.castShadow = true;
                }
              })
            }
          }
        });

        this.webXRScene.Scene.add(this.vorhangSchiene);
      });
    }).then(()=>{
      
      this.SetupPreset();
      console.log("%c -> everything is loaded", "background:#4caf50;color:#fff;padding:.2rem;");
    });


    //binding
    this.PlayActionByName = this.PlayActionByName.bind(this);
    this.ChangeAnimationStep = this.ChangeAnimationStep.bind(this);

  }

  SetupPreset = () => {
    console.log("%c apply presets at start", "background:#4caf50;color:#fff;padding:.2rem;");

    this.customMaskMaterial.SetRadius(5);
    this.customMaskMaterial.SetPosition({x:0,y:1,z:0});
      

  }

  SetupMaterials(el){
    let standardMaterial = new THREE.MeshStandardMaterial({
      color : 0xffffff,
      roughness : .5,
      metalness : .8,
      envMap : this.envMap
    });
    el.children.map((child, index)=>{
      if(child.hasOwnProperty("material")){
        child.material = this.customMaskMaterial;
      }
    });
  }

  PlayActionByName(clipName){
    console.log(clipName, this.library, MaskPositions[clipName]);

    //Step
    var offset = 1;//this.webXRScene.Controls.GetCurrentXRMode() != "Desktop" ? 1 : 1;
    this.currentStep = this.steps.indexOf(clipName);

    
    //define some variables
    var clip = this.library.VorhangSchiene.actions[clipName];

    var maskTargetPos = {
      x : MaskPositions[clipName].target_x,
      y : MaskPositions[clipName].target_y,
      z : MaskPositions[clipName].target_z,
    };
    var maskCameraPos = {
      x : MaskPositions[clipName].cam_x,
      y : MaskPositions[clipName].cam_y,
      z : MaskPositions[clipName].cam_z,
    };
    var radius = MaskPositions[clipName].radius;

    //Für den ersten und letzten Step mach das Seil sichtbar 
    this.meshLine.visible = clipName == "";
    
    //update ui
    this.textUI.SetHeadline(clipName+ " ");
    this.textUI.SetText(MaskPositions[clipName].Description);
    this.textUI.SetPosition(maskTargetPos.x,maskTargetPos.y,maskTargetPos.z);

    if(this.webXRScene.Controls.GetCurrentXRMode() == "Desktop"){
    //sets position and target of controls
      this.webXRScene.Controls.SetPosition(maskCameraPos.x,maskCameraPos.y + offset,maskCameraPos.z);
      this.webXRScene.Controls.SetTarget(maskTargetPos.x,maskTargetPos.y + offset,maskTargetPos.z, 2);
    }
      //update visual sphere
      this.sphere.position.set(maskTargetPos.x,maskTargetPos.y + offset ,maskTargetPos.z);
      this.sphere.scale.set(radius * 2,radius * 2,radius * 2);

      //update actual mask material
      this.customMaskMaterial.SetRadius(radius);
      this.customMaskMaterial.SetPosition(maskTargetPos);
      

    //wenn eine Animation hinterlegt ist
    console.log(MaskPositions, this.library.VorhangSchiene.actions, this.library.VorhangSchiene.actions.hasOwnProperty(clipName), clipName);
    if(this.library.VorhangSchiene.actions.hasOwnProperty(clipName)){ 
      //play animation
      this.library.VorhangSchiene.mixer.stopAllAction();
      this.library.VorhangSchiene.actions[clip.name].reset();
      this.library.VorhangSchiene.actions[clip.name].play();
    }

    return Object.assign({
      clipName : clipName
    },MaskPositions[clipName]);
  }


  ChangeAnimationStep(dir){
    var nextStep = this.currentStep + dir;
    nextStep = nextStep > (this.steps.length - 1) ? 0 : nextStep;
    nextStep = nextStep < 0 ? (this.steps.length - 1) : nextStep;

    return this.PlayActionByName(this.steps[nextStep]);

  }

};
  
export default MainScene;