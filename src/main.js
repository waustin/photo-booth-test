import Vue from 'vue'
import VueRouter from 'vue-router';

import App from './App.vue'
import babelPolyfill from 'babel-polyfill'
import VueHtml2Canvas from 'vue-html2canvas';

import './assets/sass/main.scss';
import router from './router'

Vue.use(VueRouter);
Vue.use(VueHtml2Canvas);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');


