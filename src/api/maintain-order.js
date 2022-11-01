import request from '@/utils/request'

export function pageMaintainOrders(params) {
  return request({
    url: 'maintain-order/page-maintain-orders',
    method: 'get',
    params: params
  })
}

export function addMaintainOrder(data) {
  return request({
    url: 'maintain-order/add-maintain-order',
    method: 'post',
    data
  })
}

export function updateMaintainOrder(data) {
  return request({
    url: 'maintain-order/update-maintain-order',
    method: 'post',
    data
  })
}

export function deleteMaintainOrder(id) {
  return request({
    url: 'maintain-order/delete-maintain-order/' + id,
    method: 'delete'
  })
}
