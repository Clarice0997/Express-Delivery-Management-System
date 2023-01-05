// 导入
import router from './router'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store'
import VueRouter from 'vue-router'

// 配置Nprogress项 关闭右上角螺旋加载提示
NProgress.configure({ showSpinner: false })

// 重写路由push和replace 解决isNavigationFailure错误
// 路由重复触发问题
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

// 全局路由前置
router.beforeEach(async (to, from, next) => {
  // 启动NProgress加载
  NProgress.start()

  // 判断是否存在Token
  const hasToken = getToken()

  // 存在Token 设置Vuex登录状态
  if (hasToken) {
    store.dispatch('setLoginIndex', true)
  }

  // 判断当前要访问页面是否需要登录才能访问
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (hasToken) {
      // 存在Token 路由登录页 直接跳转主页
      if (to.path.match('/express/login')) {
        next({ path: '/express/home' })
        NProgress.done()
      } else {
        next()
        NProgress.done()
      }
    } else {
      // 不存在Token跳转登录页并弹窗提醒
      Message({
        message: '当前未登录',
        type: 'warning',
        duration: 1000
      })
      next('/express/login')
      NProgress.done()
    }
  } else {
    // 如果路由地址不用校验则放行
    next()
    NProgress.done()
  }
})

// 全局路由后置
router.afterEach(() => {
  // 停止NProgress加载
  NProgress.done()
})
