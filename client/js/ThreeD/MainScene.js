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

class MainScene{

  constructor(){
  this.library = {};
  this.webXRScene = new webXRScene("main-scene-canvas");

  var ambientLight = new AmbientLight(0x0c0c0c);
  this.webXRScene.Scene.add(ambientLight);

  var spotLight = new SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);

  spotLight.castShadow = true;

  this.webXRScene.Scene.add(spotLight);
  this.webXRScene.Camera.SetPosition(1,0.014,0);
  this.webXRScene.Controls.Update();

  // Load envMap.
  this.webXRScene.textureLoader = new THREE.TextureLoader();
  this.envMap = this.webXRScene.textureLoader.load(HDRI);

  
  /*** */
  var sphereGeo = new THREE.SphereGeometry(.5,32,32);
  var sphereMat = new CustomFresnelMaterial({
    color : new THREE.Color(0xff0000),
    opacity : .1
  });
  

  this.sphere = new THREE.Mesh(sphereGeo,sphereMat);
  this.sphere.scale.set(0,0,0);
  this.webXRScene.Scene.add(this.sphere);

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
    // dashArray : .01,
    // dashOffset : .01,
		dashRatio: .5,
		depthWrite: true,
		depthTest: false,
		alphaTest: 0,
		transparent: true,
    side: THREE.DoubleSide
  });
  const meshLine = new THREE.Mesh(line, this.meshLineMaterial);
//   this.webXRScene.Renderer.scene.add(meshLine);
//   this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
//     this.meshLineMaterial.dashOffset -= .00001;
// });

/* Text */
  this.textUI = new Text_UI(this.webXRScene);
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
    console.log(progress);
  });
  
// //   //load stack of objects
  this.webXRScene.Loader.loadStack({
    stack : vorhangSchiene
  }).then((library)=>{
    this.library = Object.assign(this.library,library);

    Object.keys(library).map((elements, index)=>{
      this.SetupMaterials(library[elements].scene);

      console.log(library[elements].actions);
      this.vorhangSchiene = library[elements].scene;

      this.webXRScene.Scene.add(this.vorhangSchiene);
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
      child.material = this.customMaskMaterial;
    }
  });
}


};
  
export default MainScene;