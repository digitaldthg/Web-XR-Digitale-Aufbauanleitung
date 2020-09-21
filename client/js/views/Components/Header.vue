<template>
  <header>
    <button class="account-button">
      <Account />
    </button>
    <div class="controls" ref="controls">
      <div class="control-button vr-button" ref="VRcontrols"><VR /></div>
      <div class="control-button ar-button" ref="ARcontrols"><AR /></div>
    </div>
  </header>
</template>
<style lang="sass" scoped>
header {
  pointer-events:all;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #fff;
  box-shadow: 0 0 1rem 0 rgba(0,0,0,.2);
  border-radius: 0 0 1rem 1rem;
  display: flex;
  justify-content: space-between;
}

button.account-button {
  width: 50px;
  height: 50px;
  align-self: center;
  margin: 1rem;
  border-radius: 50px;
  box-shadow: 0 .25rem .5rem 0 rgba(0,0,0,.2);

  svg{
    width:35px;
    height:35px;
  }
}



.controls{
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
}

</style>
<style lang="sass">
.control-button{
  background:#fff;
  display: flex;
  align-items: center;
  width:100%;
  margin:0 1rem;
  position: relative;
  border-radius: .5rem;
  box-shadow: 0 0 .5rem 0 rgba(0,0,0,.2);
  padding: .5rem 1rem;

  svg{
    width:25px;
    height:25px;
    margin-right:.5rem;
  }
}
.control-button button {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  border: 0;
  outline: none;
  white-space: nowrap;
  left: initial!important;
  width: initial!important;
}
</style>
<script>
import Account from '../../Icons/Account.svg';
import store from '../../store';
import VR from '../../Icons/VR.svg';
import AR from '../../Icons/AR.svg';

export default {
  name : "Header",
  store : store,
  components:{
    Account,
    VR,
    AR
  },
  created(){},
  mounted(){
    var ARButton = store.state.mainScene.webXRScene.Renderer.GetARButton();
    var VRButton = store.state.mainScene.webXRScene.Renderer.GetVRButton();
    this.$refs.ARcontrols.appendChild(ARButton);
    this.$refs.VRcontrols.appendChild(VRButton);
    console.log(this.$refs.controls);
    console.log("mounted Header" , store.state.mainScene.webXRScene.Renderer.GetARButton());
  }
}

</script>