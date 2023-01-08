<template>
  <div class="container">
    <div class="login-container">
      <h3>后台管理系统</h3>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="medium">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" clearable prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password">
          <el-input v-model="form.password" show-password prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-button type="primary" v-loading.fullscreen="fullscreenLoading" :loading="btnLoading" @click="clickLoginHandler">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginAPI, userInfoAPI } from '@/apis/loginAPI'
import { setToken } from '@/utils/auth'
import { setCookie } from '@/utils/cookie'
import router from '@/router'
import store from '@/store'

export default {
  name: 'ExpressDeliveryManagementSystemLoginView',

  data() {
    return {
      // 表单数据对象
      form: {
        username: '',
        password: ''
      },
      // 表单校验对象
      rules: {
        username: [
          // 必填项校验
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          // 长度校验
          {
            min: 6,
            max: 20,
            message: '登录名长度在6-20字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          // 必填项校验
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          // 长度校验
          {
            min: 6,
            max: 20,
            message: '登录密码长度在6-20字符之间',
            trigger: 'blur'
          }
        ]
      },
      // Loading显隐
      fullscreenLoading: false,
      // 按钮加载状态
      btnLoading: false
    }
  },

  mounted() {},

  methods: {
    // 点击登录按钮处理函数
    clickLoginHandler() {
      // 校验表单
      this.$refs.form.validate(async valid => {
        if (valid) {
          // Loading遮罩
          this.fullscreenLoading = true
          // 加载按钮
          this.btnLoading = true
          // 发起登录网络请求
          loginAPI(this.form.username, this.form.password)
            .then(async ({ data }) => {
              if (data.code === 200) {
                // 保存Token
                setToken(data.data.token)
                // 获取用户信息
                await userInfoAPI()
                  .then(({ data }) => {
                    console.log(data)
                    if (data.code === 200) {
                      // Vuex保存登录索引
                      store.dispatch('setLoginIndex', true)
                      // Vuex保存用户信息
                      store.dispatch('setUserInfo', data.data.data)
                      // cookie保存用户信息
                      setCookie('userInfo', data.data.data)
                      // 成功登录弹窗
                      this.$message({
                        message: data.message,
                        type: 'success',
                        duration: 2000
                      })
                      // 登录成功跳转首页
                      router.replace('/home')
                    } else {
                      this.$message({
                        message: '登录失败',
                        type: 'error',
                        duration: 2000
                      })
                    }
                  })
                  .catch(err => {
                    console.log(err)
                    this.$message({
                      message: err,
                      type: 'error',
                      duration: 2000
                    })
                  })
              } else if (data.code === 400 && data.data.message === '当前用户不可用') {
                this.$message({
                  message: data.data.message,
                  type: 'error',
                  duration: 2000
                })
              }
            })
            .catch(err => {
              console.log(err)
              this.$message({
                message: err,
                type: 'error',
                duration: 2000
              })
            })
            .finally(() => {
              // 停止加载按钮
              this.btnLoading = false
              // 停止全屏遮罩
              this.fullscreenLoading = false
              // 重置表单数据
              this.form = this.$options.data().form
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  /* 100%窗口高度 */
  height: 100vh;
  /* 弹性布局 水平+垂直居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 渐变背景 */
  background: linear-gradient(200deg, #f3e7e9, #e3eeff);
}
.login-container {
  background-color: #fff;
  width: 500px;
  height: 200px;
  position: relative;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgb(0 0 0 / 10%);
  display: flex;
  padding: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  h3 {
    font-size: 25px;
    margin-bottom: 20px;
    text-align: center;
  }
}
.el-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .el-button {
    width: 100px;
    margin: auto;
  }
}
</style>
