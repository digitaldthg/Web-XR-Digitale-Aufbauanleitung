<template>
  <div class="home">
    {{message}}
    <button v-on:click="start">Start</button>
    <button v-on:click="stop">Stop</button>
  </div>
</template>

<style lang="sass">
  main{
    position: relative;
  }
</style>

<script>
import Vue from 'vue/dist/vue.js';
  import MainScene from '../ThreeD/main-scene';


  const mainScene = new MainScene();
  // mainScene.loop.start();

export default {
  name : "Home",
  components : {},
  props :{},
  computed:{},
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  methods: {
    start: ()=>{
      mainScene.loop.start();
    },
    stop: ()=>{
      mainScene.loop.stop();
    },
    counter:  ()=>{
      console.log(mainScene.animateCube());
    }
  } 
}
</script>

