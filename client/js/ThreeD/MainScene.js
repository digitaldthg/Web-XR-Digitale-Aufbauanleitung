import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import {Renderer,Update,webXRScene} from 'webxrscene';
import vorhangSchiene from '../ThreeD/Vorhangschiene';

const MainScene = (function(){

  this.webXRScene = new webXRScene("main-scene-canvas");
  

  console.log("MainScene" , this.webXRScene);
  
  this.webXRScene.Events.addEventListener("OnAnimationLoop",()=>{
     TWEEN.update();
  });

// //   //load stack of objects
  this.webXRScene.Loader.loadStack({
      progress: (percentage)=>{
        //console.log("progress", percentage);
      },
      stack : vorhangSchiene
  }).then((library)=>{
    console.log("library", library);
    this.library = library;

    Object.keys(this.library).map((elements, index)=>{
      this.webXRScene.Renderer.scene.add(this.library[elements].scene);
    });
  });


});
  
export default MainScene;