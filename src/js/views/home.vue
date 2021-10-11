<template>
  <div class="home">
    <Header />
    <ProgressOverlay />
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
import ProgressOverlay from './Components/ProgressOverlay.vue';
import MainScene from '../ThreeD/MainScene';


export default {
  name: "Home",
  components: {
    Header,
    Footer,
    Notification,
    ProgressOverlay
  },
  computed:{
    ShowProgressBar(){
      console.log(this.$store.state.loaded)
      return !this.$store.state.loaded;
    }
  },
  mounted() {
    this.Init();
  },  
  methods: {
    Init() {
      this.$store.commit("SetMainScene", new MainScene(this.$store));
    },
  },
};
</script>
