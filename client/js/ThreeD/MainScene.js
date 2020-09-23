import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import {Renderer,Update,webXRScene} from 'webxrscene';
import vorhangSchiene from '../ThreeD/Vorhangschiene';
import SeilSetup from '../ThreeD/Seil';
import SeilPoints from '../ThreeD/seilPoints';
import { AmbientLight,SpotLight } from 'three';
import HDRI from '../../textures/studio002small.png';
import Text_UI from './Text_UI';
import CustomMaterial from './customMaterial';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import Common from '../Common/Common';

const MainScene = (function(){

  this.library = {};
  this.webXRScene = new webXRScene("main-scene-canvas");

  var ambientLight = new AmbientLight(0x0c0c0c);
  this.webXRScene.Renderer.scene.add(ambientLight);

  var spotLight = new SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);

  spotLight.castShadow = true;

  this.webXRScene.Renderer.scene.add(spotLight);
  this.webXRScene.Renderer.camera.instance.position.set(0.34,0.014,0.23);
  this.webXRScene.Renderer.controls.desktop.instance.update();

  // Load envMap.
  this.webXRScene.textureLoader = new THREE.TextureLoader();
  this.envMap = this.webXRScene.textureLoader.load(HDRI);

  console.log("MainScene" , this.webXRScene);


  let points  = []
  SeilPoints.forEach((sP)=>{
    points.push(new THREE.Vector3(sP.x, sP.y,sP.z));
  })
  const line = new MeshLine();
  line.setPoints(points);
  this.meshLineMaterial = new MeshLineMaterial({
    lineWidth : .006,
    color : 0x333333,
    dashArray : .01,
    dashOffset : .01,
		dashRatio: .5,

    // opacity: 1,
		// dashArray: .02,
		// dashOffset: .02,
		// resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ),
		// sizeAttenuation: false,
		depthWrite: true,
		depthTest: false,
		alphaTest: 0,
		transparent: true,
    side: THREE.DoubleSide
    

  });
  const meshLine = new THREE.Mesh(line, this.meshLineMaterial);


  this.webXRScene.Renderer.scene.add(meshLine);
  



  this.textUI = new Text_UI(this.webXRScene);

  this.customMaterial = new CustomMaterial();
  
  this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
    TWEEN.update();
    ThreeMeshUI.update();
    this.textUI.Update();

    this.customMaterial.update();
    this.meshLineMaterial.dashOffset -= .00001;
    //console.log(this.meshLineMaterial.dashOffset);
  });

// //   //load stack of objects
  this.webXRScene.Loader.loadStack({
      progress: (percentage)=>{
        //console.log("progress", percentage);
      },
      stack : vorhangSchiene
  }).then((library)=>{
    console.log("library", library);
    this.library = Object.assign(this.library,library);

    Object.keys(library).map((elements, index)=>{
      console.log(this);
      this.SetupMaterials(library[elements].scene);
      this.webXRScene.Renderer.scene.add(library[elements].scene);
    });
  });
  


  
  this.SetupMaterials = (el) =>{
    console.log(el);
    let standardMaterial = new THREE.MeshStandardMaterial({
      color : 0xffffff,
      roughness : .5,
      metalness : .8,
      envMap : this.envMap
    });
    el.children.map((child, index)=>{
      if(child.hasOwnProperty("material")){
        child.material = this.customMaterial;
      }
      console.log(child);

    })
  }
});
  
export default MainScene;