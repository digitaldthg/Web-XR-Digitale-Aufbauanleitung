<template>
  <div class="home">
    <!-- <ProgressOverlay/> -->
    <Header />
    <Notification />
    <!-- <ShaderDev /> -->
    <Footer/>
  </div> 
</template>

<style lang="scss">

$darkColor: #505050;
$backgroundColor: #FDFDFF;
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family: 'Roboto', sans-serif;
}

html,body{
  width:100%;
  height:100%;
  overflow: hidden;
  position: relative;
  background-color:$backgroundColor;
}

span._hidden {
  position: absolute;
  opacity: 0;
}

svg{
  display: block;
  width: 50px;
  height: 50px;
  margin: auto;

  *{
    fill: #606060;
  }
}

button{
  background: transparent;
  border: 0;
  outline: none;
  cursor: pointer;
}

#main-scene-canvas{
  width: 100%;
  height: 100%;
  position: fixed;
  bottom:0;
  left: 0;
  top:0;  
  right: 0;
}

canvas {
  outline: 0;
}

main,.home{
  pointer-events: none;
}

header,footer{
  pointer-events: all;
}

  main,.home{
    position: relative;
    width:100%;
    height:100%;
  }

  
  aside{
    position:absolute;
    top:0;
    left:0;
    height:100%;
    overflow:scroll;
    
  }
</style>

<script>
import 'es6-promise/auto';

import Vue from 'vue';

import MainScene from '../ThreeD/MainScene';
//import LibraryItem from './LibraryItem.vue';
import Header from './Components/Header.vue';
import ProgressOverlay from './Components/ProgressOverlay.vue';
import Footer from './Components/Footer.vue';
import Notification from './Components/Notification.vue';
import ShaderDev from './Components/ShaderDev.vue';

export default {
  name : "Home",
  components:{
    Header,
    Footer,
    ProgressOverlay,
    ShaderDev,
    Notification
  },
  mounted(){
    this.Init();

  },
  data() {
    return {
      library : {},
      mainScene : {},
      message: 'Hello Vue!'
    }
  },
  methods: {
      Init(){

        console.log(this, this.$store);
        this.$store.state.mainScene.webXRScene.Events.addEventListener("OnLoadStack",(arg)=>{
          this.$store.commit("SetLibrary",arg);
          
        }); 
    },
  }
};
</script>

