import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import {webXRScene} from '../../webxrscene/src';
import vorhangSchiene from '../ThreeD/Vorhangschiene';
import SeilSetup from '../ThreeD/Seil';
import SeilPoints from '../ThreeD/seilPoints';
import { AmbientLight,MeshBasicMaterial,SpotLight } from 'three';
import HDRI from '../../textures/studio002small.png';
import Text_UI from './Text_UI';
import CustomFresnelMaterial from './customFresnelMaterial';
import CustomMaskMaterial from './customMaskMaterial';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import Common from '../Common/Common';

import MaskPositions from './MaskPositions';


class MainScene{

  constructor(store){
    window._custom = {}
    this.store = store;
    this.library = {};
    this.currentStep = -1;
    this.activeBone = null;
    var sortedSteps = Object.keys(MaskPositions).sort((a,b)=>{
      return MaskPositions[a].Schritt - MaskPositions[b].Schritt;
    }).map((keyName, index)=>{
      return keyName;
    });
    
    this.steps = sortedSteps;

    this.webXRScene = new webXRScene("main-scene-canvas");

    this.webXRScene.Mixer.timeScale = .000001;

    this.webXRScene.Events.addEventListener("OnChangeXRView",(mode)=>{
      
      if(mode.xrMode != "Desktop"){
        this.webXRScene.Controls.SetPosition(-3,1.8,0);
        //console.log(this.library.VorhangSchiene);
        //this.library.VorhangSchiene.scene.position.y = 1;
      }

      if(mode.xrMode == "AR"){
        this.webXRScene.Renderer.instance.setClearColor(0x000000,0);
      }else{
        this.webXRScene.Renderer.instance.setClearColor(0xffffff,1);
      }


    });
    var ambientLight = new AmbientLight(0x0c0c0c);
    this.webXRScene.Scene.add(ambientLight);

    var spotLight = new SpotLight(0xffffff);
    spotLight.position.set(5, 15, 0);
    spotLight.angle = 30 * Math.PI / 180;
    spotLight.penumbra = 1;
    spotLight.target.position.set(0,0,0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;  // default
    spotLight.shadow.mapSize.height = 1024; // default
    spotLight.shadow.camera.near = 0.1;    // default
    spotLight.shadow.camera.far = 20;     // default
    spotLight.shadow.focus = 1;
    spotLight.shadow.bias = .1;

    var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    this.webXRScene.Scene.add( spotLightHelper );
    // var helper = new THREE.CameraHelper( spotLight );
    // this.webXRScene.Scene.add( helper );


    this.webXRScene.Scene.add(spotLight);
    
    this.webXRScene.Camera.SetPosition(2,1.8,1);
    this.webXRScene.Controls.SetTarget(0,1,0);
    this.webXRScene.Controls.Update();

    // Load envMap.
    this.webXRScene.textureLoader = new THREE.TextureLoader();
    this.envMap = this.webXRScene.textureLoader.load(HDRI);

    
    /*** */
    var sphereGeo = new THREE.RingGeometry(.5,.52,32,1);
    var sphereMat = new MeshBasicMaterial({
      color : new THREE.Color(0x0B499D),
      side : THREE.DoubleSide,
      //blending : THREE.AdditiveBlending
    });
    
    var sphereMatOpacity = new THREE.MeshBasicMaterial({
      color : new THREE.Color(0x0B499D),
      opacity : .3,
      side : THREE.BackSide,
      depthTest : false,
      depthWrite: false

    });
    
    this.sphere = new THREE.Mesh(sphereGeo,sphereMat);
    this.sphere.scale.set(0,0,0);
    this.webXRScene.Scene.add(this.sphere);
    
    this.sphereFill = new THREE.Mesh(new THREE.SphereGeometry(.52,32,32), sphereMatOpacity );
    this.sphereFill.scale.set(0,0,0);
    this.sphereFill.visible = false;
    this.webXRScene.Scene.add(this.sphereFill);

    this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
      this.sphere.lookAt( this.webXRScene.Controls.GetCameraPosition() );
    });

    
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
    this.customMaskMaterial.envMap = this.envMap;
    this.customMaskMaterial.metalness = 1;
    this.customMaskMaterial.roughness = .8;

    window._custom.maskMaterial = this.customMaskMaterial;

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
        console.log(library[elements]);

        library[elements].mixer.timeScale = .1;
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
        console.log(this.vorhangSchiene);
        this.webXRScene.Scene.add(this.vorhangSchiene);
      });
    }).then(()=>{
      
      this.SetupPreset();
      console.log("%c -> everything is loaded", "background:#4caf50;color:#fff;padding:.2rem;");
    });



    this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
      this.SetMaskPosition();
    });



    //binding
    this.PlayActionByName = this.PlayActionByName.bind(this);
    this.ChangeAnimationStep = this.ChangeAnimationStep.bind(this);
    this.SetMaskPosition = this.SetMaskPosition.bind(this);
  }

  SetupPreset = () => {
    console.log("%c apply presets at start", "background:#4caf50;color:#fff;padding:.2rem;");




    // this.customMaskMaterial.SetRadius(5);
    // this.customMaskMaterial.SetPosition({x:0,y:1,z:0});
      

  }

  SetupMaterials(el){
    let standardMaterial = new THREE.MeshStandardMaterial({
      color : 0xffffff,
      roughness : .2,
      metalness : 1,
      envMap : this.envMap
    });
    el.children[1].children.map((child, index)=>{
      if(child.hasOwnProperty("material")){
        child.material = this.customMaskMaterial;

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  SetMaskPosition(){
    if(this.activeBone != null){
      var position = new THREE.Vector3();
      this.activeBone.getWorldPosition(position);
      this.sphere.position.set(position.x,position.y ,position.z);      
      this.sphereFill.position.set(position.x,position.y ,position.z);
      
      //console.log(this.library.VorhangSchiene.scene.children[1]);

      this.library.VorhangSchiene.scene.children[1].children.map((child)=>{
        child.material.SetPosition({
          x : position.x,
          y : position.y - 1,
          z : position.z
        });

        child.material.SetRadius(2)

      });
    }
  }


  StartAnimation(pos,target){
    var startPos = this.webXRScene.Controls.GetCameraPosition();
    var startTarget = this.webXRScene.Controls.GetTarget();
    var endPos = Object.assign({},pos);
    var endTarget = Object.assign({},target);

    const tween = new TWEEN.Tween({
      pos : startPos,
      target : startTarget,
    }) // Create a new tween that modifies 'coords'.
          .to({
            pos : endPos,
            target : endTarget,
          }, 2000) // Move to (300, 200) in 1 second.
          .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
          .onUpdate((value) => {
            this.webXRScene.Controls.SetPosition(value.pos.x,value.pos.y,value.pos.z);
            this.webXRScene.Controls.SetTarget(value.target.x,value.target.y,value.target.z);
          })
          .start() // Start the tween immediately.
          
          

    // this.webXRScene.Controls.SetPosition(startPos.x,startPos.y,startPos.z);
    // this.webXRScene.Controls.SetTarget(startTarget.x,startTarget.y,startTarget.z);



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

    if(this.webXRScene.Controls.GetCurrentXRMode() === "Desktop"){
    //sets position and target of controls
    this.StartAnimation({
      x : maskCameraPos.x,
      y : maskCameraPos.y + offset,
      z : maskCameraPos.z
    },
    {
      x : maskTargetPos.x,
      y : maskTargetPos.y + offset,
      z : maskTargetPos.z
    })
      this.webXRScene.Controls.SetPosition(maskCameraPos.x,maskCameraPos.y + offset,maskCameraPos.z);
      this.webXRScene.Controls.SetTarget(maskTargetPos.x,maskTargetPos.y + offset,maskTargetPos.z);
    }

   // console.log("activeBone" ,  MaskPositions[clipName].active_bone);
    var spherePos = Object.assign({},maskTargetPos);
    
    if(MaskPositions[clipName].active_bone != null){
      var activeBoneName = MaskPositions[clipName].active_bone;
      var activeBone = this.library.VorhangSchiene.scene.children[0].children.filter(b => b.name == activeBoneName);
      if(activeBone.length > 0){
        this.activeBone = activeBone[0];
      }
    }else{
      this.activeBone = null;
    }
    this.sphere.position.set(spherePos.x,spherePos.y + offset ,spherePos.z);      
    this.sphereFill.position.set(spherePos.x,spherePos.y + offset ,spherePos.z);
    
      this.sphere.scale.set(radius * 2,radius * 2,radius * 2);
      this.sphereFill.scale.set(radius * 2,radius * 2,radius * 2);

      //update actual mask material

      // console.log(this.library.VorhangSchiene.scene.children[1].children[0]);
      // console.log(this.library.VorhangSchiene.scene.children[1].children[1]);

      this.library.VorhangSchiene.scene.children[1].children.map((child)=>{
        child.material.SetRadius(radius);
        child.material.SetPosition(spherePos);
      });
    //wenn eine Animation hinterlegt ist
   // console.log(MaskPositions, this.library.VorhangSchiene.actions, this.library.VorhangSchiene.actions.hasOwnProperty(clipName), clipName);
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