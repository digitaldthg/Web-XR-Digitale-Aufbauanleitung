//import * as THREE from 'three';
import '../style/main.scss';

import Vue from 'vue/dist/vue.js';
import home from './views/home.vue';

import store from './store';
import { createApp } from 'vue'

//Vue.use(Vuex);

// const app = createApp({
// 	el: '#app',
// 	render: h => h(home)
// });

new Vue({
	el: '#app',
	store : store,
	render: h => h(home)
});