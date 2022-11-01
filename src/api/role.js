import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}
export function listRoles(params) {
  return request({
    url: 'role/list-roles',
    method: 'get',
    params: params
  })
}

export function pageRoles(params) {
  return request({
    url: '/page-roles',
    method: 'get',
    params: params
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: 'role/add-role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `role/update-role`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `role/delete-role/${id}`,
    method: 'delete'
  })
}
