import Mock from 'mockjs'

const data = Mock.mock({
  'items|6': [{
    id: '@guid',
    'username|1': ['John', 'Tom', 'Julia', 'Leehom', 'Black star', 'Admin'],
    'name|1': ['kafka', 'postgres', 'metadata', 'thingsboard'],
    status: '@integer(0,4)',
    description: '@cparagraph(1,3)',
    createTime: '@datetime',
    updateTime: '@datetime',
    additionalInfo: '{imageName:postgres:9.6}'
  }]
})

export default [
  {
    url: '/softwarelab-ui/instances/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
