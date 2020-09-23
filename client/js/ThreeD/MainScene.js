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

class MainScene{

  constructor(){
  this.library = {};
  this.webXRScene = new webXRScene("main-scene-canvas");

  var ambientLight = new AmbientLight(0x0c0c0c);
  this.webXRScene.Renderer.scene.add(ambientLight);

  var spotLight = new SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);

  spotLight.castShadow = true;

  this.webXRScene.Renderer.scene.add(spotLight);
  this.webXRScene.Renderer.camera.SetPosition(0.34,0.014,0.23);
  this.webXRScene.Renderer.controls.update();

  // Load envMap.
  this.webXRScene.textureLoader = new THREE.TextureLoader();
  this.envMap = this.webXRScene.textureLoader.load(HDRI);

  
/* Line */
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
		depthWrite: true,
		depthTest: false,
		alphaTest: 0,
		transparent: true,
    side: THREE.DoubleSide
  });
  const meshLine = new THREE.Mesh(line, this.meshLineMaterial);
  this.webXRScene.Renderer.scene.add(meshLine);
  this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
    this.meshLineMaterial.dashOffset -= .00001;
});

/* Text */
  this.textUI = new Text_UI(this.webXRScene);
  this.customMaterial = new CustomMaterial();
  this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
    this.customMaterial.update();
  });


  this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
    TWEEN.update();
    ThreeMeshUI.update();
    this.textUI.Update();    
  });

  this.webXRScene.Events.addEventListener("OnProgress" , (progress) =>{
    console.log(progress);
  });
  
// //   //load stack of objects
  this.webXRScene.Loader.loadStack({
    stack : vorhangSchiene
  }).then((library)=>{
    this.library = Object.assign(this.library,library);

    Object.keys(library).map((elements, index)=>{
      this.SetupMaterials(library[elements].scene);
      this.webXRScene.Renderer.scene.add(library[elements].scene);
    });
  });
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
      child.material = this.customMaterial;
    }
  });
}


};
  
export default MainScene;