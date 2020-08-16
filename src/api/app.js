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

export function getVersionsByAppName(appName) {
  return request({
    url: '/appVersions?op=simple',
    method: 'get',
    params: {
      name: appName
    }
  })
}

export function getVersionByAppNameAndVersion(appName, version) {
  return request({
    url: '/appVersions/' + appName + '/' + version,
    method: 'get'
  })
}
