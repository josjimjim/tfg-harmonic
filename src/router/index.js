import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'
import SimplePendulum from '@/components/objects/SimplePendulum'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/pendulo/simple',
      name: 'SimplePendulum',
      component: SimplePendulum
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
