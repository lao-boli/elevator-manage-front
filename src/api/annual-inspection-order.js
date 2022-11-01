import request from '@/utils/request'

export function pageAnnualInspectionOrders(params) {
  return request({
    url: 'annual-inspection-order/page-annual-inspection-orders',
    method: 'get',
    params: params
  })
}

export function addAnnualInspectionOrder(data) {
  return request({
    url: 'annual-inspection-order/add-annual-inspection-order',
    method: 'post',
    data
  })
}

export function updateAnnualInspectionOrder(data) {
  return request({
    url: 'annual-inspection-order/update-annual-inspection-order',
    method: 'post',
    data
  })
}

export function deleteAnnualInspectionOrder(id) {
  return request({
    url: 'annual-inspection-order/delete-annual-inspection-order/' + id,
    method: 'delete'
  })
}
