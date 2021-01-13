import Vue from 'vue'
import VueRouter from 'vue-router'
import PhotoMoment from '../views/PhotoMoment.vue';
import BackgroundRemove from '../views/BackgroundRemove.vue';
import WebcamDemo from '../views/WebcamDemo.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'photo-moment',
    component: PhotoMoment
  },
  {
    path: '/background-remove',
    name: 'background-remove',
    component: BackgroundRemove,
  },
  {
    path: '/webcam-demo',
    name: 'webcam-demo',
    component: WebcamDemo,
  },
]

const router = new VueRouter({
  routes
})

export default router
