<template>
  <div class="home">
    <Header />
    <Notification />
    <Footer />
  </div>
</template>
<style src="@/style/main.scss" lang="scss"></style>
<script>
import "es6-promise/auto";
import Header from "./Components/Header.vue";
import Footer from "./Components/Footer.vue";
import Notification from "./Components/Notification.vue";

export default {
  name: "Home",
  components: {
    Header,
    Footer,
    Notification
  },
  mounted() {
    this.Init();
  },
  data() {
    return {
      library: {},
      mainScene: {},
      message: "Hello Vue!",
    };
  },
  methods: {
    Init() {
      
      this.$store.state.mainScene.webXRScene.Events.addEventListener(
        "OnLoadStack",
        (arg) => {
          this.$store.commit("SetLibrary", arg);
        }
      );
    },
  },
};
</script>
