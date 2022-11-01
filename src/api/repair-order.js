import request from '@/utils/request'

export function pageRepairOrders(params) {
  return request({
    url: 'repair-order/page-repair-orders',
    method: 'get',
    params: params
  })
}

export function addRepairOrder(data) {
  return request({
    url: 'repair-order/add-repair-order',
    method: 'post',
    data
  })
}

export function updateRepairOrder(data) {
  return request({
    url: 'repair-order/update-repair-order',
    method: 'post',
    data
  })
}

export function deleteRepairOrder(id) {
  return request({
    url: 'repair-order/delete-repair-order/' + id,
    method: 'delete'
  })
}
