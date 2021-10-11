<template>
<transition name="fade">
  <div class="progress-overlay" v-if="visible">
    <div class="progress-bar">
      <div class="progress-bar-inner" :style="{ width : GetProgress}"></div>
    </div>
  </div>
</transition>
</template>
<style lang="scss" scoped>
.progress-overlay{
  width:100%;
  height:100%;
  position: absolute;
  background: rgba(255,255,255 , 0.8);
  top:0;
  left:0;
  right:0;
  bottom:0;
  display: flex;
    justify-content: center;
  align-items: center;
}

.progress-bar{
  width:80%;
  max-width:300px;
  height:10px;
  border-radius : 5px;
  background:#ccc;
  padding:2px;
}

.progress-bar-inner{
  width: 0;
  height:100%;
  border-radius : 5px;
  background:$darkColor;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
<script>

export default {
  name : "ProgressOverlay",
  data(){
    return {
      percentage : 0,
      visible : true
    }
  },
  computed:{
    GetProgress: function(){
      return this.percentage + "%";
    }
  },
  mounted(){
    this.$nextTick(()=>{

      this.$store.state.mainScene.webXRScene.Events.addEventListener("OnProgress",(loading)=>{
        this.percentage = loading.progress * 100;
      });
      
      this.$store.state.mainScene.webXRScene.Events.addEventListener("OnLoadStack",(loading)=>{
        this.visible = false;
      });
    })
  }

}
</script>