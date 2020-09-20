import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import {Renderer,Camera,Update,Loader,DesktopControls} from 'webxrscene';

import ape from '../../model/ape.gltf';
import vorhangSchiene from '../ThreeD/Vorhangschiene';

const MainScene = (function(){


  //console.log(new Renderer("main-scene-canvas"));
  this.renderer = new Renderer("main-scene-canvas");
  this.scene = new THREE.Scene();
  this.camera = new Camera();
  this.loader = new Loader();
  this.controls ={
    desktop : new DesktopControls(this.camera.instance, this.renderer.instance.domElement)
  } 

//   //load stack of objects
  this.loader.loadStack({
      progress: (percentage,singleProgress)=>{console.log("progress", percentage,singleProgress);},
      stack : vorhangSchiene
}).then((library)=>{
    console.log("library", library);

    Object.keys(library).map((elements, index)=>{
      this.scene.add(library[elements].scene);
    });
  });


  //load single model
  this.loader.load({
    url : ape,
    progress : (percentage)=>{
      console.log(percentage);
    },
  }).then((gltf)=>{
    this.scene.add(gltf.scene);
  }).catch((err)=>{
    console.log("error: " , err );
  }).finally(()=>{
    console.log("load complete");
  });
  

  // var geometry = new THREE.BoxGeometry();
  // var material = new THREE.MeshNormalMaterial();
  // var cube = new THREE.Mesh( geometry, material );
  // this.scene.add( cube );
  
  this.animateCube = () =>{

    const start = {x: 0, y: 0,z:0} // Start at (0, 0)
    const end = {x: 1, y: 1,z:1} // Start at (0, 0)
    const tween = new TWEEN.Tween(start) // Create a new tween that modifies 'coords'.
      .to(end, 1000) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        cube.position.set(start.x,start.y,start.z);  
      })
      .start() // Start the tween immediately.
    
  }

  this.loop = new Update();

  this.loop.AddUpdateMethod("common", ()=>{
      TWEEN.update();
     this.renderer.instance.render( this.scene, this.camera.instance );
  });
  
  
  // this.loop.AddUpdateMethod("desktopControls", ()=>{
  //   this.controls.desktop.controls.update();
  // });

});
  
export default MainScene;