import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/login/LoginView.vue'

Vue.use(VueRouter)

// 配置路由跳转
const routerPush = VueRouter.prototype.push

VueRouter.prototype.push = function (location) {
  return routerPush.call(this, location).catch(err => {
    console.log(err)
  })
}

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
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/home/HomeView.vue'),
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '',
        redirect: 'main'
      },
      {
        path: 'main',
        name: '主页',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/home/Home.vue')
      },
      {
        path: 'adminManage',
        name: '快递员管理',
        component: () => import(/* webpackChunkName: "adminManage" */ '@/views/adminManage/AdminManage.vue')
      },
      {
        path: 'expressManage',
        name: '管理员快递管理',
        component: () => import(/* webpackChunkName: "expressManage" */ '@/views/expressManage/ExpressManage.vue')
      },
      {
        path: 'expressDelivery',
        name: '快递员快递管理',
        component: () => import(/* webpackChunkName: "expressDelivery" */ '@/views/expressDelivery/ExpressDelivery.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
