<template>
  <div class="library-items">
    <div class="item" v-for="item in this.$store.state.library" :key="item.name">
      <input type="checkbox" :checked="item.scene.visible" :model="item.scene.visible" v-on:input="e=>changeVisibility(e,item)" />
      <button v-on:click="callItem(item)">{{ item.name }}</button>
      <button :key="value.name" v-on:click="playClip(value)" v-for="value in item.actions">
        {{value.name}}
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>

.library-items{
  padding:1rem;
}


</style>
<script>
import Vue from 'vue';
import store from '../store';

export default {
  props:[
    "mainScene",
    "library"
  ],
  store : store,
  mounted (){


    console.log("mainScene from LibraryItem", this.$props.library,  this.$props.mainScene);
  },
  methods:{
    changeVisibility(e,item){
      item.scene.visible = e.target.checked;
      console.log(e.target.checked,item.scene.visible);
    },
    callItem(item){
      console.log(item);
    },
    playClip(clip){
     // clip.clampWhenFinished = true;
      console.log(clip);
      clip.play();
    }
  }
};

</script>