import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/apps',
    method: 'get',
    params
  })
}

export function getType() {
  return request({
    url: '/apps/type',
    method: 'get'
  })
}
