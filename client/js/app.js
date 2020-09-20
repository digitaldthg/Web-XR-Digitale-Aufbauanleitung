//import * as THREE from 'three';
import '../style/main.scss';
import Vue from 'vue/dist/vue.js';
import home from './views/home.vue';

new Vue({
	el: '#app',
	render: h => h(home)
});