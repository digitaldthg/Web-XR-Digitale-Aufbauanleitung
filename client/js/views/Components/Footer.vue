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
          <div class="footer-content-icons">

            <div class="icon">Icon</div>
            <div class="icon">Icon</div>
            <div class="icon">Icon</div>
          </div>
      </div>
      <div class="footer-content-nav" v-if="this.$store.state.library.VorhangSchiene" >
      
          <button class="footer-content-nav-items" v-on:click="playClip('Schienenteile')"><span class="_hidden">Schienenteile</span></button>
          <button class="footer-content-nav-items" v-on:click="playClip('Zugwagen')"><span class="_hidden">Zugwagen</span></button>
          <button class="footer-content-nav-items" v-on:click="playClip('Zweilaufradwagen')"><span class="_hidden">Zweilaufradwagen</span></button>
          <button class="footer-content-nav-items" v-on:click="playClip('Umlenkrolle')"><span class="_hidden">Umlenkrolle</span></button>
          <button class="footer-content-nav-items" v-on:click="playClip('Abstandshalter')"><span class="_hidden">Abstandshalter</span></button>
          <button class="footer-content-nav-items" v-on:click="playClip('Feststeller')"><span class="_hidden">Feststeller</span></button>
          <button class="footer-content-nav-items" v-on:click="playClip('Rohrhaken')"><span class="_hidden">Rohrhaken</span></button>
          
          <!-- <button class="footer-content-nav-items" v-on:click="playClip(value)" :key="value.name" v-for="value in this.$store.state.library.VorhangSchiene.actions">
            <span class="_hidden">{{value.name}}</span>
          </button> -->
        </div>
        
      </div>
     
      <div class="footer-content">
        <button class="nav-buttons" v-on:click="ChangeAnimationStep(1)"><Next/></button>
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

.footer-inner{
  padding:1rem;
  background: #fff;
  border-radius: 2rem;
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

.footer-content-nav-items{
  height: 100%;
  flex:1;
  border:1px solid #ccc;
  margin-right:5px;
  border-radius: 3px;
  &:last-child{
    margin-right:0;
  }
}

.flex-height {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.flex-width {
  display: flex;
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

export default {
  name :"Footer",
  store : store,
  components:{
    Prev,
    Next
  },
  data(){
    return {
      headline: "",
      text : "Hallo und willkommen im Vorhangschienen XR Tutorial",
      currentStep : -1,
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

      var mainScene = this.$store.state.mainScene;
      this.$data.currentStep = mainScene.PlayActionByName(clipName);

      //update html text
      this.$data.headline = clipName;
      this.$data.text = this.$store.state.MaskPositions[clipName].message;
     
    },
    ChangeAnimationStep(dir){
      this.$store.state.mainScene.ChangeAnimationStep(dir);
    }
  }
}
</script>