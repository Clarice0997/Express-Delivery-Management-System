import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/login/LoginView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登录页面',
    component: LoginView
  },
  {
    path: '/home',
    name: '主页',
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/home/HomeView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
