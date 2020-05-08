import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/softwarelab-ui/instances/list',
    method: 'get',
    params
  })
}
