import request from '@/utils/request'

export function listCompanies(params) {
  return request({
    url: 'company/list-companies',
    method: 'get',
    params: params
  })
}
export function pageCompanies(params) {
  return request({
    url: 'company/page-companies',
    method: 'get',
    params: params
  })
}

export function addCompany(data) {
  return request({
    url: 'company/add-company',
    method: 'post',
    data
  })
}

export function updateCompany(data) {
  return request({
    url: 'company/update-company',
    method: 'post',
    data
  })
}

export function deleteCompany(id) {
  return request({
    url: 'company/delete-company/' + id,
    method: 'delete'
  })
}
