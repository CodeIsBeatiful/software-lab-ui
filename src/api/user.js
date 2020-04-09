import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/softwarelab-ui/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/softwarelab-ui/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/softwarelab-ui/user/logout',
    method: 'post'
  })
}
