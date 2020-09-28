<template>
  <div class="home">
    <!-- <ProgressOverlay/> -->
    <Header />
    
    <Footer/>
  </div> 
</template>

<style lang="sass">
  main,.home{
    position: relative;
    width:100%;
    height:100%;
    pointer-events:none;
  }
  aside{
    position:absolute;
    top:0;
    pointer-events:all;
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
import store from '../store';

export default {
  name : "Home",
  store : store,
  components:{
    Header,
    Footer,
    ProgressOverlay
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

