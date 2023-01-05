<template>
  <div>
    <el-container>
      <el-header>
        <div class="logo-container">
          <h3>快递管理系统</h3>
          <div class="toggle-container">
            <i :class="toggleClass"></i>
          </div>
        </div>
        <div class="user-container">
          <div class="userInfo">
            <i class="el-icon-user"></i>
          </div>
          <div class="logout">
            <i class="el-icon-switch-button"></i>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="300px">
          <el-menu v-for="(item, index) in menuList" :key="index" :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
            <el-menu-item :index="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
          <p class="footer">版权所有@快递管理系统 2021-2022</p>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'ExpressDeliveryManagementSystemHomeView',

  data() {
    return {
      // 伸缩导航栏图标class
      toggleClass: 'el-icon-s-fold',
      menuList: [
        {
          index: '/home/main',
          icon: 'el-icon-s-home',
          title: '主页'
        },
        {
          index: '/home/adminManage',
          icon: 'el-icon-user',
          title: '快递员管理'
        },
        {
          index: '/home/expressManage',
          icon: 'el-icon-folder',
          title: '快递管理'
        }
      ]
    }
  },

  mounted() {},

  methods: {}
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #18bc9c;
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;
  .logo-container {
    width: 350px;
    display: flex;
    h3 {
      width: 300px;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      line-height: 60px;
    }
    .toggle-container {
      width: 50px;
      height: 100%;
      i {
        font-size: 28px;
        display: block;
        transition: color 0.15s linear;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
      }
      i:hover {
        color: #c1ff5c;
      }
    }
  }
  .user-container {
    width: 150px;
    display: flex;
    font-size: 28px;
    transition: color 0.15s linear;
    text-align: center;
    line-height: 60px;
    margin-right: 20px;
    .userInfo {
      width: 75px;
    }
    .logout {
      width: 75px;
    }
    i {
      transition: color 0.15s linear;
      cursor: pointer;
    }
    i:hover {
      color: #c1ff5c;
    }
  }
}
.el-aside {
  height: calc(100vh - 60px);
  background-color: #545c64;
  .el-menu {
    border-right: 0;
  }
  .el-menu-item {
    padding-left: 30px !important;
  }
}
.el-main {
  height: calc(100vh - 60px);
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.footer {
  height: 60px;
  line-height: 60px;
}
</style>
