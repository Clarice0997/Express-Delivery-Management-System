// 导入封装axios对象
import request from '@/utils/request.js'

/**
 * 管理员获取所有快递API
 * @param {*} status
 * @returns
 */
export const getAllExpresses = function (status) {
  if (status === 0) {
    return request.get('apis/admin/express/express')
  } else {
    return request.get('apis/admin/express/express', { params: { status: status } })
  }
}

/**
 * 揽收API
 * @param {*} expressId
 * @param {*} courierId
 * @param {*} deliveryId
 * @param {*} status
 * @returns
 */
export const arrangeCourier = function (expressId, courierId, status) {
  return request.put(
    'apis/admin/express/express/arrange',
    { expressId, courierId, status },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

/**
 * 派送API
 * @param {*} expressId
 * @param {*} deliveryId
 * @param {*} status
 * @returns
 */
export const arrangeDelivery = function (expressId, deliveryId, status) {
  return request.put(
    'apis/admin/express/express/arrange',
    { expressId, deliveryId, status },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

/**
 * 拒收API
 * @param {*} expressId
 * @returns
 */
export const rejectExpress = function (expressId) {
  return request.put(`apis/admin/express/express/rejection/${expressId}`)
}

/**
 * 快递员获取所有快递API
 * @param {*} status
 * @returns
 */
export const getSelfExpresses = function (status) {
  if (status === 0) {
    return request.get('apis/admin/express/courier/express')
  } else {
    return request.get('apis/admin/express/courier/express', { params: { status: status } })
  }
}

/**
 * 快递员揽收拒收快递
 * @param {*} expressId
 * @param {*} status
 * @returns
 */
export const courierHandle = function (expressId, status) {
  return request.put(`apis/admin/express/courier/express/${expressId}`, { status })
}
