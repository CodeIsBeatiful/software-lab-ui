import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/instances',
    method: 'get',
    params: query
  })
}

export function createInstance(data) {
  // TODO data 进行处理转换为containerInfo
  return request({
    url: '/instances',
    method: 'post',
    data
  })
}

export function removeInstance(id) {
  return request({
    url: '/instances/' + id,
    method: 'delete'
  })
}

export function startInstance(id) {
  return request({
    url: '/instanceOperation/' + id,
    method: 'post',
    data: 'op=start'
  })
}

export function stopInstance(id) {
  return request({
    url: '/instanceOperation/' + id,
    method: 'post',
    data: 'op=stop'
  })
}

