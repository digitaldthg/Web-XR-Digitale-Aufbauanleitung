import Vue from 'vue';
import Vuex from 'vuex';
import StaticContent from '../Content/StaticContent';
Vue.use(Vuex);


export const store = new Vuex.Store({
  state: {
    currentLibraryItem: "VorhangSchiene",
    currentAnimationClip: 0,
    currentStepMessage: {},
    mainScene: null,
    library: {},
    loaded : false,
    StaticContent: StaticContent
  },
  mutations: {
    SetMainScene(state, mainScene){
      state.mainScene = mainScene;
    },
    // Setzt alle geladenen Elemente als library 
    SetLibrary(state, library) {
      state.library = library;
    },
    // Setzt die Message des aktuellen Aufbauschritts als currentStepMessage
    SetCurrentStep(state, stepMessage) {
      state.currentStepMessage = stepMessage;
    },
    SetLoaded(state,loaded){

      console.log(state, loaded);
      state.loaded = loaded;
    }
  }
});
