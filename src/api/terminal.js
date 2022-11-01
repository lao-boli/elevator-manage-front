import request from '@/utils/request'

export function pageTerminals(params) {
  return request({
    url: 'terminal/page-terminals',
    method: 'get',
    params: params
  })
}

export function addTerminal(data) {
  return request({
    url: 'terminal/add-terminal',
    method: 'post',
    data
  })
}

export function updateTerminal(data) {
  return request({
    url: 'terminal/update-terminal',
    method: 'post',
    data
  })
}

export function deleteTerminal(id) {
  return request({
    url: 'terminal/delete-terminal/' + id,
    method: 'delete'
  })
}
