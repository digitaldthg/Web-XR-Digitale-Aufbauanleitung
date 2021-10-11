<template>
  <header>
    <button class="account-button">
      <Account />
    </button>
    <div class="controls" ref="controls">
      <div class="control-button vr-button" ref="VRcontrols"><VR /></div>
      <div class="control-button ar-button" ref="ARcontrols"><AR /></div>
      <FullscreenButton />
    </div>
  </header>
</template>
<style lang="scss" scoped>
header {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #fff;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
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
  box-shadow: 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.2);

  svg {
    width: 35px;
    height: 35px;
  }
}

.controls {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.control-button {
  background: #fff;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0 1rem;
  position: relative;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2);
  padding-left: 0.5rem;
  svg {
    width: 25px;
    height: 25px;
    margin-right: 0.5rem;
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
  left: initial !important;
  width: initial !important;
  padding: 1rem;
}
</style>
<script>
import Account from "../../Icons/Account.svg";
import VR from "../../Icons/VR.svg";
import AR from "../../Icons/AR.svg";

import FullscreenButton from "./FullscreenButton.vue";

export default {
  name: "Header",
  components: {
    Account,
    VR,
    AR,
    FullscreenButton,
  },
  created() {},
  mounted() {
    this.$nextTick(()=>{

      this.CreateXRButtons();
    });
  },
  methods: {
    CreateXRButtons() {
      var ARButton = this.$store.state.mainScene.webXRScene.Controls.GetARButton();
      ARButton._domOverlayElement = document.getElementById("main-dom-element");

      var VRButton = this.$store.state.mainScene.webXRScene.Controls.GetVRButton();
      VRButton.addEventListener("click", () => {
        console.log("VR enabled");
      });
      this.$refs.ARcontrols.appendChild(ARButton);
      this.$refs.VRcontrols.appendChild(VRButton);
    },
  },
};
</script>
