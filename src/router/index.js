import Vue from 'vue'
import VueRouter from 'vue-router'
import PhotoMoment from '../views/PhotoMoment.vue';
import BackgroundRemove from '../views/BackgroundRemove.vue';
import WebcamDemo from '../views/WebcamDemo.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/photo-moment',
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
  /*{
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
   // component: () => import( '../views/About.vue')
  }
  */
]

const router = new VueRouter({
  routes
})

export default router
