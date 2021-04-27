//import * as THREE from 'three';


import Vue from 'vue/dist/vue.js';
import home from './js/views/home.vue';

import {store} from './js/store';
import { createApp } from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex);

// const app = createApp({
// 	el: '#app',
// 	render: h => h(home)
// });

new Vue({
	el: '#app',
	store,
	render: h => h(home)
});