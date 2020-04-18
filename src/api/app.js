import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/softwarelab-ui/apps/list',
    method: 'get',
    params
  })
}
