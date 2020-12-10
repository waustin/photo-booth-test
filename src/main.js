import Vue from 'vue'
import App from './App.vue'
import babelPolyfill from 'babel-polyfill'
import VueHtml2Canvas from 'vue-html2canvas';

import './assets/sass/main.scss';

Vue.use(VueHtml2Canvas);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app');


