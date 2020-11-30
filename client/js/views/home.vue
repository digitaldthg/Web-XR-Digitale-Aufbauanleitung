<template>
  <div class="home">
    <!-- <ProgressOverlay/> -->
    <Header />
    <Notification />
    <!-- <ShaderDev /> -->
    <Footer/>
  </div> 
</template>

<style lang="sass">
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

import MainScene from '../ThreeD/mainScene';
//import LibraryItem from './LibraryItem.vue';
import Header from './Components/Header.vue';
import ProgressOverlay from './Components/ProgressOverlay.vue';
import Footer from './Components/Footer.vue';
import Notification from './Components/Notification.vue';
import store from '../store';
import ShaderDev from './Components/ShaderDev.vue';

export default {
  name : "Home",
  store : store,
  components:{
    Header,
    Footer,
    ProgressOverlay,
    ShaderDev,
    Notification
  },
  created(){
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
      Init:function(){
        store.state.mainScene.webXRScene.Events.addEventListener("OnLoadStack",(arg)=>{
          store.commit("SetLibrary",arg);
          
        }); 
    },
  }
};
</script>

