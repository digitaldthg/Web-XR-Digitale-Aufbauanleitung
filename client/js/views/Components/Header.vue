<template>
  <header>
    <button class="account-button">
      <Account />
    </button>
    <div class="controls" ref="controls">
      <div class="control-button vr-button" ref="VRcontrols"><VR /></div>
      <div class="control-button ar-button" ref="ARcontrols"><AR /></div>
    </div>

    <div class="shaderControls">
      <input type="range" value="0.001" step=".0001" v-on:input="ChangeDist"/>
      <input type="range" min="0" max=".8" value="0.001" step=".0001" v-on:input="ChangeRadius"/>
      <input type="range" min="-5" max="5" value="0.001" step=".0001" v-on:input="e=>ChangePos(e,'x')"/>
      <input type="range" min="-5" max="5" value="0.001" step=".0001" v-on:input="e=>ChangePos(e,'y')"/>
      <input type="range" min="-5" max="5" value="0.001" step=".0001" v-on:input="e=>ChangePos(e,'z')"/>
      <button v-on:click="e=>GetCameraPos()">Get Camera Position</button>

    </div>
  </header>
</template>
<style lang="sass" scoped>
header {
  
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
    var ARButton = store.state.mainScene.webXRScene.Controls.GetARButton();
    var VRButton = store.state.mainScene.webXRScene.Controls.GetVRButton();
    this.$refs.ARcontrols.appendChild(ARButton);
    this.$refs.VRcontrols.appendChild(VRButton);
  },
  methods:{
    GetCameraPos(){
      var pos = store.state.mainScene.webXRScene.Camera.instance.position;
      console.log({...pos});
    },
    ChangeDist(e){

      store.state.mainScene.customMaskMaterial.userData.shader.uniforms.dist.value = parseFloat(e.target.value);
    },
    ChangeRadius(e){
      console.log("radius", e.target.value);
      //window.radius  = e.target.value;
      store.state.mainScene.customMaskMaterial.userData.shader.uniforms.radius.value = parseFloat(e.target.value);
      store.state.mainScene.sphere.scale.x = parseFloat(e.target.value) * 2;
      store.state.mainScene.sphere.scale.y = parseFloat(e.target.value) * 2;
      store.state.mainScene.sphere.scale.z = parseFloat(e.target.value) * 2;
      
    },
    ChangePos(e, axis){
      store.state.mainScene.customMaskMaterial.userData.shader.uniforms.customPositionVector.value[axis] = parseFloat(e.target.value);
      store.state.mainScene.sphere.position[axis] = parseFloat(e.target.value);
      
      console.log(store.state.mainScene.customMaskMaterial.userData.shader.uniforms.customPositionVector.value);
    }
  }
}

</script>