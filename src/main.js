import Vue from 'vue/dist/vue.js';
import home from './js/views/home.vue';

/**
 * Initialize Store und mache ihn global verfügbar
 */

import {store} from './js/store';
import Vuex from 'vuex';
Vue.use(Vuex);

new Vue({
  el: '#app',
  store,
  render: h => h(home)
});
