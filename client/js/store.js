import Vue from 'vue';

import Vuex from 'vuex';
import MainScene from './ThreeD/mainScene';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentLibraryItem: "VorhangSchiene",
    currentAnimationClip: 0,
    mainScene : new MainScene(),
    library : {},
  },
  mutations: {
    increment (state) {
      state.count++
    },
    SetLibrary(state,library){
      state.library = library;
    },
    PlayClip(state,clip){

      console.log(state, clip);
      clip.play();
    }

  }
})

export default store;