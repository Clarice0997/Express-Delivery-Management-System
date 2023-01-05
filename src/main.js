// 重置css样式
import '@/assets/css/reset.css'

// 整合elementUI
import './plugins/element.js'

// 导入Vue相关模块
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入VueCookie处理模块
import VueCookies from 'vue-cookies'

// permission控制
import './permission'

Vue.config.productionTip = false

Vue.use(VueCookies)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
