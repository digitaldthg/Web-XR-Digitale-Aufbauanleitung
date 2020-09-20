<template>
  <div class="home"> 
    <aside>
        <LibraryItem :library="this.library" :mainScene="this.mainScene"/>
    </aside>
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
import Vue from 'vue/dist/vue.js';
import MainScene from '../ThreeD/mainScene';
import LibraryItem from './LibraryItem.vue';

export default {
  name : "Home",
  components:{
    LibraryItem
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
      this.mainScene = new MainScene();

      console.log("mainScene" , this.mainScene.webXRScene);

      this.mainScene.webXRScene.Events.addEventListener("OnLoadStack",(arg)=>{
        this.library = arg;
      });
      
    },
    
    enableAR:function (params) {
      //this.mainScene.GetARButton();
      console.log(this.mainScene);
    },
    enableVR:function (params) {
      //this.mainScene.GetVRButton();
      console.log(this.mainScene);
    }
  }
};
</script>

