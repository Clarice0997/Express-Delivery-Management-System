// 导入封装axios对象
import request from '@/utils/request.js'

/**
 * 登录API
 * @param {*} username
 * @param {*} password
 * @returns
 */
export const loginAPI = function (username, password) {
  return request.post('system/admin/login', {
    username,
    password
  })
}

/**
 * 获取用户信息接口
 * @returns
 */
export const userInfoAPI = function () {
  return request.get('system/admin/getInfo')
}
