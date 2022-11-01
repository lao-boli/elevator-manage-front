import request from '@/utils/request'

export function getTypeStatistics(params) {
  return request({
    url: 'abnormal-record/get-type-statistics',
    method: 'get',
    params: params
  })
}
export function pageAbnormalRecords(params) {
  return request({
    url: 'abnormal-record/page-abnormal-records',
    method: 'get',
    params: params
  })
}

export function addAbnormalRecord(data) {
  return request({
    url: 'abnormal-record/add-abnormal-record',
    method: 'post',
    data
  })
}

export function updateAbnormalRecord(data) {
  return request({
    url: 'abnormal-record/update-abnormal-record',
    method: 'post',
    data
  })
}

export function deleteAbnormalRecord(id) {
  return request({
    url: 'abnormal-record/delete-abnormal-record/' + id,
    method: 'delete'
  })
}
