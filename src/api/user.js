import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}
export function getInfo(token) {
  return request({
    url: 'get-info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}

export function pageUsers(params) {
  return request({
    url: 'user/page-users',
    method: 'get',
    params: params
  })
}

export function addUser(data) {
  return request({
    url: 'user/add-user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'user/update-user',
    method: 'post',
    data
  })
}
export function changePassword(data) {
  return request({
    url: 'user/change-password',
    method: 'post',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: 'user/delete-user/' + id,
    method: 'delete'
  })
}
