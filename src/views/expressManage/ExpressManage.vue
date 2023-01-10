<template>
  <div>
    <!-- 顶部操作区卡片 -->
    <!-- shadow设置阴影显示时机 -->
    <el-card shadow="hover" class="top-card">
      <!-- 按钮区 -->
      <el-button type="primary" :disabled="btnDisabled === 0 ? true : false" @click="topBtnHandler(0)">全部</el-button>
      <el-button type="primary" :disabled="btnDisabled === 1 ? true : false" @click="topBtnHandler(1)">待揽收</el-button>
      <el-button type="primary" :disabled="btnDisabled === 3 ? true : false" @click="topBtnHandler(3)">待派件</el-button>
    </el-card>
    <!-- 主体表格区卡片 -->
    <el-card shadow="hover" class="body-card">
      <!-- element表格 用户表格 -->
      <el-table ref="expressManagerTable" :data="expressData" tooltip-effect="dark" class="expressManagerTable" height="600" max-height="600" :default-sort="{ prop: 'id', order: 'ascending' }" :border="true">
        <!-- 快递单号列 -->
        <el-table-column label="快递单号" width="160" prop="expressId"> </el-table-column>
        <!-- 寄件人列 -->
        <el-table-column label="寄件人" width="120">
          <template slot-scope="scope">
            <div style="text-align: center">
              <p>{{ scope.row.senderName }}</p>
              <p>{{ scope.row.senderPhone }}</p>
            </div>
          </template>
        </el-table-column>
        <!-- 寄件人地址列 -->
        <el-table-column label="寄件人地址" width="220">
          <template slot-scope="scope">
            <div style="text-align: center">
              <p>{{ scope.row.senderProvince }} {{ scope.row.senderCity }} {{ scope.row.senderDistrict }}</p>
              <p>{{ scope.row.receiverAddress }}</p>
            </div>
          </template>
        </el-table-column>
        <!-- 收件人列 -->
        <el-table-column label="收件人" width="120">
          <template slot-scope="scope">
            <div style="text-align: center">
              <p>{{ scope.row.receiverName }}</p>
              <p>{{ scope.row.receiverPhone }}</p>
            </div>
          </template>
        </el-table-column>
        <!-- 收件人地址列 -->
        <el-table-column label="收件人地址" width="220">
          <template slot-scope="scope">
            <div style="text-align: center">
              <p>{{ scope.row.receiverProvince }} {{ scope.row.receiverCity }} {{ scope.row.receiverDistrict }}</p>
              <p>{{ scope.row.receiverAddress }}</p>
            </div>
          </template>
        </el-table-column>
        <!-- 状态列 -->
        <el-table-column label="状态" width="80" sortable>
          <template slot-scope="scope">
            <!-- 标签 -->
            <!-- 判断当前快递状态 -->
            <el-tag>{{ scope.row.status | statusText }}</el-tag>
          </template>
        </el-table-column>
        <!-- 重量列 -->
        <el-table-column label="重量" width="80" prop="weight"> </el-table-column>
        <!-- 类型列 -->
        <el-table-column label="类型" width="100" prop="type"> </el-table-column>
        <!-- 下单时间列 -->
        <el-table-column label="下单时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.orderTime | formatTime }}
          </template>
        </el-table-column>

        <!-- 管理员操作列  -->
        <el-table-column label="操作" v-if="this.roleId === 1">
          <template slot-scope="scope">
            <el-button type="success" size="mini" v-if="scope.row.status === '0'" @click="arrangeBtnClickHandler(scope.row, 1)">揽收</el-button>
            <el-button type="success" size="mini" v-if="scope.row.status === '3'" @click="arrangeBtnClickHandler(scope.row, 2)">派件</el-button>
            <el-button type="danger" size="mini" v-if="scope.row.status !== '5' && scope.row.status !== '9'" @click="rejectExpressHandler(scope.row)">拒收</el-button>
          </template>
        </el-table-column>
        <!-- 快递员操作列  -->
        <el-table-column label="操作" v-if="this.roleId === 2">
          <template slot-scope="scope">
            <el-button type="success" size="mini" v-if="scope.row.status === '1'" @click="courierHandler(scope.row, 1)">揽收</el-button>
            <el-button type="danger" size="mini" v-if="scope.row.status === '4'" @click="courierHandler(scope.row, 2)">派件</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="empty">
            <img src="@/assets/img/empty.png" />
            <span>暂无用户数据</span>
          </div>
        </template>
      </el-table>
    </el-card>
    <!-- 选择收件快递员对话框 -->
    <el-dialog :visible.sync="courierDialogVisible" width="20%" title="选择收件快递员" style="text-align: left">
      <label style="font-weight: bold; margin-right: 5px">快递员</label>
      <el-select v-model="courierSelected" placeholder="快递员">
        <el-option v-for="item in avaliableCourierList" :key="item.id" :label="item.username" :value="item.id"> </el-option>
      </el-select>
      <div class="buttons-container">
        <el-button type="primary" @click="clickCourierConfirmHandler">确定</el-button>
        <el-button @click="clickCourierDialogCancleHandler">取消</el-button>
      </div>
    </el-dialog>
    <!-- 选择派件快递员对话框 -->
    <el-dialog :visible.sync="deliveryDialogVisible" width="20%" title="选择派件快递员" style="text-align: left">
      <label style="font-weight: bold; margin-right: 5px">快递员</label>
      <el-select v-model="deliverySelected" placeholder="快递员">
        <el-option v-for="item in avaliableCourierList" :key="item.id" :label="item.username" :value="item.id"> </el-option>
      </el-select>
      <div class="buttons-container">
        <el-button type="primary" @click="clickDeliveryConfirmHandler">确定</el-button>
        <el-button @click="clickDeliveryDialogCancleHandler">取消</el-button>
      </div>
    </el-dialog>
    <!-- 确认对话框 -->
    <el-dialog :visible.sync="checkDialogVisible" width="30%">
      <p style="text-align: left; margin-bottom: 10px">是否{{ checked ? '揽收' : '妥投' }}这个快件了</p>
      <div class="buttons-container">
        <el-button type="primary" @click="checkDialogConfirmHandler">确定</el-button>
        <el-button @click="checkDialogCancleHandler">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllExpresses, arrangeCourier, arrangeDelivery, rejectExpress, getSelfExpresses, courierHandle } from '@/apis/expressAPI'
import { getAvaliableCourier } from '@/apis/adminAPI'
import { formatDate } from '@/utils/formatDate'

export default {
  name: 'ExpressDeliveryManagementSystemExpressManage',

  data() {
    return {
      // 顶部按钮禁用
      btnDisabled: 0,
      // 当前用户角色
      roleId: this.$store.state.userInfo.type,
      courierDialogVisible: false,
      deliveryDialogVisible: false,
      checkDialogVisible: false,
      checked: true,
      row: {},
      courierSelected: '',
      deliverySelected: '',
      // 表格数据源
      expressData: [],
      // 在岗快递员列表
      avaliableCourierList: []
    }
  },

  filters: {
    // 状态文本过滤器
    statusText(val) {
      if (val === '0') {
        return '待审核'
      } else if (val === '1') {
        return '待揽收'
      } else if (val === '2') {
        return '运输中'
      } else if (val === '3') {
        return '待派件'
      } else if (val === '4') {
        return '派件中'
      } else if (val === '5') {
        return '已投妥'
      } else if (val === '8') {
        return '已撤单'
      } else if (val === '9') {
        return '拒收'
      }
    },
    // 时间格式过滤器
    formatTime(val) {
      return formatDate(new Date(val), 'yyyy-MM-dd hh:mm:ss')
    }
  },

  mounted() {
    // 获取表格数据
    if (this.roleId === 1) {
      this.getAllExpresses(this.btnDisabled)
    } else if (this.roleId === 2) {
      this.getSelfExpresses(this.btnDisabled)
    }
    // 获取当前在岗快递员
    getAvaliableCourier().then(({ data }) => {
      if (data.code === 200) {
        this.avaliableCourierList = data.data.data
      }
    })
  },

  methods: {
    // 顶部操作区按钮点击事件
    topBtnHandler(num) {
      this.btnDisabled = num
      if (this.roleId === 1) {
        this.getAllExpresses(this.btnDisabled)
      } else if (this.roleId === 2) {
        this.getSelfExpresses(this.btnDisabled)
      }
    },
    // 管理员获取所有快递数据
    getAllExpresses(status) {
      getAllExpresses(status)
        .then(({ data }) => {
          if (data.code === 200) {
            this.expressData = data.data.data
            this.$message({
              message: '获取数据成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '数据为空',
              type: 'warning'
            })
            this.expressData = []
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '获取快递信息失败',
            type: 'error'
          })
        })
    },
    // 快递员获取所有快递数据
    getSelfExpresses(status) {
      getSelfExpresses(status)
        .then(({ data }) => {
          if (data.code === 200) {
            this.expressData = data.data.data
            this.$message({
              message: '获取数据成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '数据为空',
              type: 'warning'
            })
            this.expressData = []
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '获取快递信息失败',
            type: 'error'
          })
        })
    },
    // 揽收派送按钮点击事件
    arrangeBtnClickHandler(item, index) {
      this.row = item
      if (index === 1) {
        this.courierDialogVisible = true
      } else {
        this.deliveryDialogVisible = true
      }
    },
    // 选择揽件快递员确认事件
    clickCourierConfirmHandler() {
      arrangeCourier(this.row.expressId, this.courierSelected, 1)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '选择揽件快递员成功',
              type: 'success'
            })
            this.getAllExpresses(this.btnDisabled)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '失败',
            type: 'error'
          })
        })
        .finally(() => {
          this.courierDialogVisible = false
          this.courierSelected = ''
          this.row = {}
        })
    },
    // 选择揽件快递员取消事件
    clickCourierDialogCancleHandler() {
      this.courierDialogVisible = false
    },
    // 选择派件快递员确认事件
    clickDeliveryConfirmHandler() {
      arrangeDelivery(this.row.expressId, this.deliverySelected, 4)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '选择派件快递员成功',
              type: 'success'
            })
            this.getAllExpresses(this.btnDisabled)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '失败',
            type: 'error'
          })
        })
        .finally(() => {
          this.deliveryDialogVisible = false
          this.deliverySelected = ''
          this.row = {}
        })
    },
    // 选择派件快递员取消事件
    clickDeliveryDialogCancleHandler() {
      this.deliveryDialogVisible = false
    },
    // 拒收快递按钮点击事件
    rejectExpressHandler(item) {
      rejectExpress(item.expressId)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '拒收成功',
              type: 'success'
            })
            this.getAllExpresses(this.btnDisabled)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '拒收失败',
            type: 'error'
          })
        })
    },
    // 快递员操作处理
    courierHandler(item, index) {
      this.row = item
      this.checkDialogVisible = true
      if (index === 1) {
        this.checked = true
      } else if (index === 2) {
        this.checked = false
      }
    },
    // 快递员揽收处理
    courierPick() {
      courierHandle(this.row.expressId, 2)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '揽收成功',
              type: 'success'
            })
            this.getSelfExpresses(this.btnDisabled)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '揽收失败',
            type: 'error'
          })
        })
        .finally(() => {
          this.checkDialogVisible = false
          this.row = {}
        })
    },
    // 快递员派件处理
    courierSend() {
      courierHandle(this.row.expressId, 5)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '派件成功',
              type: 'success'
            })
            this.getSelfExpresses(this.btnDisabled)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '派件失败',
            type: 'error'
          })
        })
        .finally(() => {
          this.checkDialogVisible = false
          this.row = {}
        })
    },
    // 确认对话框确定事件
    checkDialogConfirmHandler() {
      if (this.checked) {
        this.courierPick()
      } else {
        this.courierSend()
      }
    },
    // 确认对话框取消事件
    checkDialogCancleHandler() {
      this.checkDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.top-card {
  display: flex;
  align-items: center;
}

.top-card,
.body-card {
  margin: 10px;
}

.body-card {
  .expressManagerTable {
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

.buttons-container {
  margin-top: 30px;
  display: flex;
  flex-direction: row-reverse;
  .el-button {
    margin-left: 10px;
  }
}
</style>
