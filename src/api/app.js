import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/apps',
    method: 'get',
    params
  })
}

export function getTypes() {
  return request({
    url: '/appTypes',
    method: 'get'
  })
}
export function getNamesByType(type) {
  return request({
    url: '/apps/names',
    method: 'get',
    params: {
      type: type
    }
  })
}
