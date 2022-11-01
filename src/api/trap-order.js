import request from '@/utils/request'

export function pageTrapOrders(params) {
  return request({
    url: 'trap-order/page-trap-orders',
    method: 'get',
    params: params
  })
}

export function addTrapOrder(data) {
  return request({
    url: 'trap-order/add-trap-order',
    method: 'post',
    data
  })
}

export function updateTrapOrder(data) {
  return request({
    url: 'trap-order/update-trap-order',
    method: 'post',
    data
  })
}

export function deleteTrapOrder(id) {
  return request({
    url: 'trap-order/delete-trap-order/' + id,
    method: 'delete'
  })
}
