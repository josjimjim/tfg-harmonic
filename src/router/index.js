import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Tools from '@/components/Tools'
import About from '@/components/About'
import SimplePendulum from '@/components/objects/SimplePendulum'
import SpringPendulum from '@/components/objects/SpringPendulum'
import CradlePendulum from '@/components/objects/CradlePendulum'
import DoublePendulum from '@/components/objects/DoublePendulum'
import TriplePendulum from '@/components/objects/TriplePendulum'
import SphericalPendulum from '@/components/objects/SphericalPendulum'
import ConicalPendulum from '@/components/objects/ConicalPendulum'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/tools/numerical',
      name: 'Tools',
      component: Tools
    },
    {
      path: '/tools/agm',
      name: 'Tools',
      component: Tools
    },
    {
      path: '/pendulum/simple',
      name: 'SimplePendulum',
      component: SimplePendulum
    },
    {
      path: '/pendulum/spring',
      name: 'SpringPendulum',
      component: SpringPendulum
    },
    {
      path: '/pendulum/cradle',
      name: 'CradlePendulum',
      component: CradlePendulum
    },
    {
      path: '/pendulum/double',
      name: 'DoublePendulum',
      component: DoublePendulum
    },
    {
      path: '/pendulum/triple',
      name: 'TriplePendulum',
      component: TriplePendulum
    },
    {
      path: '/pendulum/spherical',
      name: 'SphericalPendulum',
      component: SphericalPendulum
    },
    {
      path: '/pendulum/conical',
      name: 'ConicalPendulum',
      component: ConicalPendulum
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
