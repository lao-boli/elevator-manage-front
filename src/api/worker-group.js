import request from '@/utils/request'

export function listWorkerGroups(params) {
  return request({
    url: 'worker-group/list-worker-groups',
    method: 'get',
    params: params
  })
}

export function pageWorkerGroups(params) {
  return request({
    url: 'worker-group/page-worker-groups',
    method: 'get',
    params: params
  })
}

export function addWorkerGroup(data) {
  return request({
    url: 'worker-group/add-worker-group',
    method: 'post',
    data
  })
}

export function updateWorkerGroup(data) {
  return request({
    url: 'worker-group/update-worker-group',
    method: 'post',
    data
  })
}

export function deleteWorkerGroup(id) {
  return request({
    url: 'worker-group/delete-worker-group/' + id,
    method: 'delete'
  })
}
