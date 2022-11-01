import request from '@/utils/request'

export function getBrandStatistics(params) {
  return request({
    url: 'elevator/get-brand-statistics',
    method: 'get',
    params: params
  })
}

export function listElevators(params) {
  return request({
    url: 'elevator/list-elevators',
    method: 'get',
    params: params
  })
}

export function pageElevators(params) {
  return request({
    url: 'elevator/page-elevators',
    method: 'get',
    params: params
  })
}

export function addElevator(data) {
  return request({
    url: 'elevator/add-elevator',
    method: 'post',
    data
  })
}

export function updateElevator(data) {
  return request({
    url: 'elevator/update-elevator',
    method: 'post',
    data
  })
}

export function deleteElevator(id) {
  return request({
    url: 'elevator/delete-elevator/' + id,
    method: 'delete'
  })
}
