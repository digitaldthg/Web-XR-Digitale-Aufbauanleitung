import Vue from 'vue';
import Vuex from 'vuex';
import MainScene from './ThreeD/MainScene';
import StaticContent from '../Content/StaticContent';
Vue.use(Vuex);


export const store = new Vuex.Store({
  state: {
    currentLibraryItem: "VorhangSchiene",
    currentAnimationClip: 0,
    currentStepMessage: {},
    mainScene: new MainScene(),
    library: {},
    StaticContent: StaticContent
  },
  mutations: {
    // Setzt alle geladenen Elemente als library 
    SetLibrary(state, library) {
      state.library = library;
    },
    // Setzt die Message des aktuellen Aufbauschritts als currentStepMessage
    SetCurrentStep(state, stepMessage) {
      state.currentStepMessage = stepMessage;
    }
  }
});
