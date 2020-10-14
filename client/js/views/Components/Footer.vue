<template>
  <footer>
    <div class="footer-inner">
      <div class="footer-content">
        <button class="nav-buttons" v-on:click="ChangeAnimationStep(-1)"><Prev/></button>
      </div>

      <div class="footer-content flex-height footer-main">
       
        <div class="footer-content-inner flex-width">
          <div class="footer-content-message">
            <h3>{{headline}}</h3>
            <p>{{text}}</p>
          </div>
          <div class="footer-content-icons" v-if="toolsNeeded.length > 0">
            <div class="icon" v-for="tool in toolsNeeded" v-bind:key="tool">
              <Hammer v-if="tool == 'Hammer' " />
              <Zange v-if="tool == 'Zange' " />
              <Schraubenschluessel v-if="tool == 'Schraubenschlüssel/Ratsche SW 13 mm' " />
              <Imbus v-if="tool == 'ISK 8 mm' " />
              <span class="tool-name">{{tool}}</span>
              
            </div>            
          </div>
        </div>
        <div class="footer-content-nav " v-if="this.$store.state.library.VorhangSchiene" >
          <button :class="'footer-content-nav-items nav-item-'+index + ' active-'+ (index <= currentStep)" v-for="(step,index) in this.stepsInOrder()" v-bind:key="step.js_name" v-on:click="playClip(step.js_name)"><span class="_hidden">{{step.js_name}}</span></button>
        </div>
        
      </div> 
      <div class="footer-content">
        <button class="nav-buttons" v-on:click="ChangeAnimationStep(1)"><Next/></button>
        {{currentStep}}
      </div>
    </div>
  </footer>
</template>

<style lang="sass" scoped>
footer{
  pointer-events:all;
  position: absolute;
  bottom:0;
  left:0;
  right:0;
  margin:auto;
  display:flex;
  justify-content: center;
  align-items: center;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content-message{
  margin-right: 1rem;
  flex: 1;
  
  p,h3 {
    font-size: 14px;
    display: inline;
  }
}

.footer-content-message,
.footer-content-icons {
  padding: 1rem;
  box-shadow: 0 0 0.5rem 0 rgba(0,0,0,.2);
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.tool-name {
  font-size: 80%;
  text-align: center;
  display: inline-block;
  width: 100%;
  color: #666;
  max-width: 160px;
}

.footer-content-icons {
  display: flex;
}
.footer-inner{
  padding:1rem;
  background: #fff;
  border-radius: 100px;
  box-shadow:0 0 1rem 0 rgba(0,0,0,.2);
  justify-content: space-between;
  display: flex;
  width:80%;
  margin-bottom:1rem;
}
.footer-main{
  flex:2;
  margin: 0 1rem;
}
.footer-content-nav {
  width: 100%;
  height: 15px;
  display: flex;
}
.footer-content-nav {
  padding: .2rem;
  box-shadow: 0 0 0.5rem 0 rgba(0,0,0,.2);
  border-radius: .5rem;
}
.footer-content-nav-items{
  height: 100%;
  flex:1;
  border:1px solid #ccc;
  margin-right:5px;
  border-radius: 3px;
  &:last-child{
    margin-right:0;
  }
  &:hover {
    background: #eee;
  }

  &.active-true{
    border:1px solid #484848;
    background: #484848;
  }
}



.flex-height {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.flex-width {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.nav-buttons{
  width: 50px;
  height:50px;
  border-radius:50%;
  box-shadow: 0 .25rem .5rem 0 rgba(0,0,0,.2); 
  display: flex;
  justify-content: center;
  align-items: center;
  
  svg{
    width:25px;
    height:25px;
  }
}
</style>
<script>

import store from '../../store';

import Prev from '../../Icons/prev.svg';
import Next from '../../Icons/next.svg';
import { StencilOp } from 'three';
import Hammer from '../../Icons/icon__Hammer.svg';
import Zange from '../../Icons/icon__Zange.svg';
import Schraubenschluessel from '../../Icons/icon__Schraubenschluessel.svg';
import Imbus from '../../Icons/icon__Imbus.svg';
import MaskPositions from '../../ThreeD/MaskPositions';

export default {
  name :"Footer",
  store : store,
  components:{
    Prev,
    Next,
    Hammer,
    Zange,
    Schraubenschluessel,
    Imbus
  },
  data(){
    return {
      headline: "",
      text : "Hallo und willkommen im Vorhangschienen XR Tutorial",
      toolsNeeded: [],
      currentStep : -1,
      stepsInOrder: ()=>{
        var steps = [];
        Object.keys(MaskPositions).map((step ,index)=>{
          steps[MaskPositions[step].Schritt - 1] = MaskPositions[step];
        });
        return steps;
      },
      steps : [
        "Schienenteile",
        "Zugwagen",
        "Zweilaufradwagen",
        "Umlenkrolle",
        "Abstandshalter",
        "Feststeller",
        "Rohrhaken"
      ]
    }
  },
  methods:{
    
    playClip(clipName){

      var mainScene = store.state.mainScene;
      mainScene.PlayActionByName(clipName);
      this.currentStep = mainScene.currentStep;
      //update html text
      this.headline = clipName;

      this.text = store.state.MaskPositions[clipName].Description;

      this.toolsNeeded = this.filterTools(store.state.MaskPositions[clipName]);
     
    },
    ChangeAnimationStep(dir){
      
      var message = store.state.mainScene.ChangeAnimationStep(dir);
      console.log(message);
      this.currentStep = store.state.mainScene.currentStep;
      this.headline = message.clipName;
      this.text = message.Description;

      this.toolsNeeded = this.filterTools(message);
    },
    filterTools(stepInfo){
      
      var toolKeyName = ["Tool_1","Tool_2","Tool_3","Tool_4","Tool_5"];
      var tools = [];
      toolKeyName.forEach((key)=>{
        if(stepInfo[key]){
          tools.push(stepInfo[key]);
        }
      });
      
      return tools;
    }
  }
}
</script>