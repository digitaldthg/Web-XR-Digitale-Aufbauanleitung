<template>
  <div class="progress-overlay">
    <div class="progress-bar">
      <div class="progress-bar-inner"></div>
    </div>
  </div>
</template>
<style lang="sass" scoped>
.progress-overlay{
  width:100%;
  height:100%;
  position: absolute;
  background: rgb(103 103 103 / 0.8);
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
  height:60px;
  border-radius : 5px;
  background:#fff;
  padding:1rem;
}

.progress-bar-inner{
  width: 0;
  height:100%;
  background:#505050;
}



</style>
<script>
import store from '../../store';

export default {
  name : "ProgressOverlay",
  store : store,
  mounted(){
    console.log(store.state.mainScene.webXRScene.Events.addEventListener("OnLoadStack",(stack)=>{
      console.log("stack" , stack)
    }));
  }

}
</script>