import request from '@/utils/request'

export function getTypeStatistics(params) {
  return request({
    url: 'fault-record/get-type-statistics',
    method: 'get',
    params: params
  })
}

export function pageFaultRecords(params) {
  return request({
    url: 'fault-record/page-fault-records',
    method: 'get',
    params: params
  })
}

export function addFaultRecord(data) {
  return request({
    url: 'fault-record/add-fault-record',
    method: 'post',
    data
  })
}

export function updateFaultRecord(data) {
  return request({
    url: 'fault-record/update-fault-record',
    method: 'post',
    data
  })
}

export function deleteFaultRecord(id) {
  return request({
    url: 'fault-record/delete-fault-record/' + id,
    method: 'delete'
  })
}
