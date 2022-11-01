import request from '@/utils/request'

export function pageUnits(params) {
  return request({
    url: 'unit/page-units',
    method: 'get',
    params: params
  })
}

export function listUnits(params) {
  return request({
    url: 'unit/list-units',
    method: 'get',
    params: params
  })
}

export function addUnit(data) {
  return request({
    url: 'unit/add-unit',
    method: 'post',
    data
  })
}

export function updateUnit(data) {
  return request({
    url: 'unit/update-unit',
    method: 'post',
    data
  })
}

export function deleteUnit(id) {
  return request({
    url: 'unit/delete-unit/' + id,
    method: 'delete'
  })
}
