import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/instances/list',
    method: 'get',
    params: query
  })
}

export function createInstance(data) {
  return request({
    url: '/vue-element-admin/instances/create',
    method: 'post',
    data
  })
}

