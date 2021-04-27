<template>
   <div class="shaderControls">
     <div class="controller-item">
      <button v-on:click="GetStore()">GetStore</button>
     </div>
     <div class="controller-item">
      <label for="dist">Change Dist</label>
      <input id="dist" type="range" value="0.001" step=".0001" v-on:input="ChangeDist"/>
     </div>
     <div class="controller-item">
      <label for="rad">Change Radius</label>
      <input id="rad" type="range" min="0" max=".8" value="0.001" step=".0001" v-on:input="ChangeRadius"/>
     </div>
     <div class="controller-item">
      <label for="pos-x">Pos X</label>
      <input id="pos-x" type="range" min="-5" max="5" value="0.001" step=".0001" v-on:input="e=>ChangePos(e,'x')"/>
     </div>
    <div class="controller-item">
      <label for="pos-y">Pos Y</label>
      <input id="pos-y" type="range" min="-5" max="5" value="0.001" step=".0001" v-on:input="e=>ChangePos(e,'y')"/>
     </div>
    <div class="controller-item">
      <label for="pos-z">Pos Z</label>
      <input id="pos-z" type="range" min="-5" max="5" value="0.001" step=".0001" v-on:input="e=>ChangePos(e,'z')"/>
     </div>
    <div class="controller-item">
      <button v-on:click="e=>GetShaderPos()">Get Shader Position</button>
     </div>
     <div class="controller-item">
      <button v-on:click="e=>GetCameraPos()">Get Camera Position</button>
     </div>
    </div>
</template>
<style lang="scss" scoped>
.shaderControls {
  pointer-events:all;
  position: absolute;
  top: 80px;
  width: 100%;
  background: rgba(0,0,0,.2);
  padding: 1rem;
  display: flex;
}

button{
  border:1px solid;
  color:#fff;
  background:#888;
  &:hover{
    background:#aaa;
  }
}
</style>

<script>

export default {
  name : "ShaderDev",
  methods:{
    GetCameraPos(){
      var pos = store.state.mainScene.webXRScene.Camera.GetPosition();
      var target = store.state.mainScene.webXRScene.Controls.GetTarget();
      console.log("cam",{...pos});
      console.log("target", {...target});
      console.log(store.state.mainScene.webXRScene.Camera.instance);
    },
    GetStore(){      
      console.log(store);
    },
    GetShaderPos(){
      console.log(store.state.mainScene.customMaskMaterial.userData.shader.uniforms.radius.value);
      console.log(store.state.mainScene.customMaskMaterial.userData.shader.uniforms.customPositionVector.value);
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

      if(axis == "y"){
        store.state.mainScene.sphere.position[axis] += 1;
      }
      
      console.log(store.state.mainScene.customMaskMaterial.userData.shader.uniforms.customPositionVector.value);
    }
  }
}
</script>