// 导入封装axios对象
import request from '@/utils/request.js'

/**
 * 查询快递员API
 * @param {*} pageNumber
 * @param {*} pageSize
 * @returns
 */
export const queryCourier = function (pageNumber, pageSize) {
  return request.get('apis/admin/adminManage/admin', { params: { pageNumber, pageSize } })
}

/**
 * 根据ID查询快递员API
 * @param {*} id
 * @returns
 */
export const queryCourierById = function (id) {
  return request.get('apis/admin/adminManage/admin/' + id)
}

/**
 * 插入快递员API
 * @param {*} param0
 * @returns
 */
export const insertCourier = function ({ username, password, nickname, phone }) {
  return request.post(
    'apis/admin/adminManage/admin',
    { username, password, nickname, phone },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

/**
 * 修改快递员状态API
 * @param {*} id
 * @param {*} status
 * @returns
 */
export const updateCourierStatus = function (id, status) {
  return request.put('apis/admin/adminManage/admin/status', { id, status })
}

/**
 * 修改快递员信息API
 * @param {*} form
 * @returns
 */
export const updateCourier = function ({ username, nickname, phone }) {
  return request.put('apis/admin/adminManage/admin', { username, nickname, phone })
}

/**
 * 删除快递员API
 * @param {*} id
 * @returns
 */
export const deleteCourier = function (id) {
  return request.delete('apis/admin/adminManage/admin/' + id)
}

/**
 * 获取所有在岗快递员
 * @returns
 */
export const getAvaliableCourier = function () {
  return request.get('apis/admin/adminManage/admin/avaliableCourier')
}
