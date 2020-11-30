import Vue from 'vue';

import Vuex from 'vuex';
import MainScene from './ThreeD/mainScene';
import MaskPositions from './ThreeD/MaskPositions';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentLibraryItem: "VorhangSchiene",
    currentAnimationClip: 0,
    currentStepMessage  : {},
    mainScene : new MainScene(),
    library : {},
    MaskPositions : MaskPositions
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
    },
    SetCurrentStep(state,stepMessage){
      console.log("stepMessage" , stepMessage);

      state.currentStepMessage  = stepMessage;

    }

  }
})

export default store;