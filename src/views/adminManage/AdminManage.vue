<template>
  <div>
    <!-- 顶部操作区卡片 -->
    <!-- shadow设置阴影显示时机 -->
    <el-card shadow="hover" class="top-card">
      <!-- 学号&姓名 输入框 -->
      <span>用户ID：</span>
      <el-input placeholder="请输入ID（精准匹配）" clearable type="number" oninput="if(value<0)value=0" class="sid-input" prefix-icon="el-icon-search" v-model="uid" @keydown.native.13="searchHandler"></el-input>
      <!-- 按钮区 -->
      <el-button type="primary" icon="el-icon-search" @click="searchHandler">查找</el-button>
      <el-button type="success" icon="el-icon-plus" @click="clickAddHandler">新增</el-button>
    </el-card>
    <!-- 主体表格区卡片 -->
    <el-card shadow="hover" class="body-card">
      <!-- element表格 用户表格 -->
      <el-table ref="userManagerTable" :data="userData" tooltip-effect="dark" class="userManagerTable" :row-class-name="tableRowClassName" height="500" max-height="700" :default-sort="{ prop: 'id', order: 'ascending' }">
        <!-- ID列 -->
        <el-table-column label="ID" width="120" prop="id" sortable> </el-table-column>
        <!-- 登录名列 -->
        <el-table-column prop="username" label="登录名" width="160"> </el-table-column>
        <!-- 昵称列 -->
        <el-table-column prop="nickname" label="昵称" width="160"> </el-table-column>
        <!-- 联系电话列 -->
        <el-table-column prop="phone" label="联系电话" width="200"> </el-table-column>
        <!-- 状态列 -->
        <el-table-column prop="status" label="状态" width="160" sortable>
          <template slot-scope="scope">
            <!-- 标签 -->
            <!-- 判断当前用户状态 -->
            <el-tag size="medium" v-if="scope.row.status == 1">正常</el-tag>
            <el-tag size="warning" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <!-- 操作列  -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" v-if="scope.row.status != 0" @click="handleDisable(scope.$index, scope.row)">禁用</el-button>
            <el-button type="success" size="mini" v-if="scope.row.status != 1" @click="handleEnable(scope.$index, scope.row)">启用</el-button>
            <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="empty">
            <img src="@/assets/img/empty.png" />
            <span>暂无用户数据</span>
          </div>
        </template>
      </el-table>
      <!-- 分页栏 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalData"> </el-pagination>
      </div>
    </el-card>
    <!-- 新增弹窗对话框 -->
    <el-dialog title="新增人员" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="medium">
        <el-form-item label="登录名" prop="username">
          <el-input v-model="form.username" clearable placeholder="登录名"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="form.password" show-password placeholder="请输登录密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="form.checkPassword" show-password placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="nickname">
          <el-input v-model="form.nickname" clearable placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" clearable placeholder="手机号码"></el-input>
        </el-form-item>
        <div class="buttons-container">
          <el-button @click="clickDialogCloseHandler">关闭</el-button>
          <el-button type="success" v-loading.fullscreen="fullscreenLoading" :loading="btnLoading" @click="clickConfirmAddHandler">确认添加</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { queryCourier, queryCourierById, insertCourier } from '@/apis/adminAPI'

export default {
  name: 'ExpressDeliveryManagementSystemAdminManage',

  data() {
    // 自定义校验 确认密码
    const repasswordValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 查询uid
      uid: '',
      // 表格页码
      pageNumber: 1,
      // 表格条数
      pageSize: 20,
      // 用户数据源
      userData: [
        // {
        //   id: 1,
        //   username: 'Clarice',
        //   nickname: 'Clarice',
        //   phone: 13960879575,
        //   status: true
        // }
      ],
      // 对话框显隐
      dialogFormVisible: false,
      // 表单数据对象
      form: {
        username: '',
        password: '',
        checkPassword: '',
        nickname: '',
        phone: ''
      },
      // 表单校验对象
      rules: {
        username: [
          // 必填项校验
          {
            required: true,
            message: '请输入登录名',
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
        ],
        checkPassword: [
          // 必填项校验
          {
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
          },
          // 长度校验
          {
            min: 6,
            max: 20,
            message: '确认密码长度在6-20字符之间',
            trigger: 'blur'
          },
          // 自定义校验 确认密码
          {
            validator: repasswordValidator,
            trigger: 'blur'
          }
        ],
        nickname: [
          {
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '真实姓名长度不合法',
            trigger: 'blur'
          }
        ],
        phone: [
          // 必填项校验
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          // 手机号格式校验
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      // 按钮Loading显隐
      fullscreenLoading: false,
      // 按钮加载状态
      btnLoading: false
    }
  },

  computed: {
    // 计算数据条数
    totalData() {
      return this.userData.length
    }
  },

  mounted() {},

  // Vue实例创建时发起网络请求
  created() {
    // 获取用户信息
    this.getUsersInfoHandler()
  },

  methods: {
    // 判断行状态函数
    tableRowClassName({ row, rowIndex }) {
      if (!row.status) {
        return 'warning-row'
      }
      return ''
    },
    // 禁用按钮点击事件
    handleDisable(index, row) {
      console.log(index)
      console.log(row)
    },
    // 启用按钮点击事件
    handleEnable(index, row) {
      console.log(index)
      console.log(row)
    },
    // 修改按钮点击事件
    handleEdit(index, row) {
      console.log(index)
      console.log(row)
    },
    // 删除按钮点击事件
    handleDelete(index, row) {
      console.log(index)
      console.log(row)
    },
    // 页面显示条数改变事件
    handleSizeChange(val) {
      // 显示条数改变重新获取用户数据
      this.getUsersInfoHandler()
    },
    // 页码改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 搜索按钮点击事件
    searchHandler() {
      // 判断输入框中输入的是否为数字
      if (this.uid === '') {
        // 默认获取用户数据
        this.getUsersInfoHandler()
      } else {
        // 重置页码
        this.pageNumber = 1
        // 根据ID查询快递员
        queryCourierById(this.uid)
          .then(({ data }) => {
            // console.log(data)
            if (data.code === 200) {
              this.$message({
                message: '获取用户信息成功',
                type: 'success'
              })
              this.userData = []
              this.userData[0] = data.data.data
            } else {
              this.$message({
                message: '获取用户信息失败',
                type: 'error'
              })
            }
          })
          .catch(err => {
            console.log(err)
            this.$message({
              message: '获取用户信息失败',
              type: 'error'
            })
          })
      }
    },
    // 点击新增按钮事件
    clickAddHandler() {
      this.dialogFormVisible = true
    },
    // 发起网络请求获取用户数据函数
    getUsersInfoHandler() {
      queryCourier(this.pageNumber, this.pageSize)
        .then(({ data }) => {
          // console.log(data)
          if (data.code === 200) {
            this.$message({
              message: '获取用户信息成功',
              type: 'success'
            })
            // 重置页码
            this.pageNumber = 1
            // 持久化数据
            this.userData = data.data.data
          } else {
            this.$message({
              message: '获取用户信息失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '获取用户信息失败',
            type: 'error'
          })
        })
    },
    // 点击关闭对话框按钮点击事件
    clickDialogCloseHandler() {
      this.dialogFormVisible = false
    },
    // 点击确认添加按钮点击事件
    clickConfirmAddHandler() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          insertCourier(this.form)
            .then(({ data }) => {
              if (data.code === 200) {
                this.$message({
                  message: '插入成功',
                  type: 'success',
                  duration: 2000
                })
                // 关闭对话框
                this.dialogFormVisible = false
              } else {
                this.$message({
                  message: data.data.message,
                  type: 'error',
                  duration: 2000
                })
              }
            })
            .catch(err => {
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
.top-card {
  display: flex;
  align-items: center;
  .el-input {
    width: 250px;
    margin-right: 20px;
  }
}

.top-card,
.body-card {
  margin: 10px;
}

.body-card {
  .userManagerTable {
    width: 100%;
    button {
      margin-right: 5px;
    }
  }
  .empty {
    // 元素上下居中
    display: flex;
    flex-direction: column;
    align-items: center;
    // 居中
    margin: auto;
    text-align: center;
    width: 20%;
    img {
      width: 30%;
    }
  }
}
.block {
  margin-top: 10px;
}
.buttons-container {
  display: flex;
  flex-direction: row-reverse;
  .el-button {
    margin-left: 10px;
  }
}
/deep/ .el-dialog__title {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
