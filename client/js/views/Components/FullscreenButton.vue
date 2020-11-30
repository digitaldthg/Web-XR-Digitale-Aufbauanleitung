<template>
  <div class="control-button fullscreen-button">
    <Fullscreen />
    <button v-on:click="Toggle()">Fullscreen</button>
  </div>
</template>
<script>

import Fullscreen from '../../Icons/Fullscreen.svg';
export default {
  name : "FullscreenButton",
  components:{
    Fullscreen
  },
  data : function(){
    return {
      isFullscreen : false
    }
  },
  methods : {
    Toggle(){
      if(this.$data.isFullscreen){
        this.ExitFullscreen();
      }else{
        this.RequestFullscreen();
      }
    },
    RequestFullscreen() {
      //console.log(this.$data , data, this);


      var element = document.documentElement;
      if(element.requestFullscreen) {
        element.requestFullscreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }

      this.$data.isFullscreen = true;
    },
    ExitFullscreen() {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.$data.isFullscreen = false;
    }
  }
}
</script>