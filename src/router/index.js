import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'
import SimplePendulum from '@/components/objects/SimplePendulum'
import DoublePendulum from '@/components/objects/DoublePendulum'
import SphericalPendulum from '@/components/objects/SphericalPendulum'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/pendulum/simple',
      name: 'SimplePendulum',
      component: SimplePendulum
    },
    {
      path: '/pendulum/double',
      name: 'DoublePendulum',
      component: DoublePendulum
    },
    {
      path: '/pendulum/spherical',
      name: 'SphericalPendulum',
      component: SphericalPendulum
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
