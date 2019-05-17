import request from '@/utils/request'

export function API_getCollector(userkey) {
  return request({
    url: '/AppClientAction_getCollector.do',
    method: 'get',
    params: { userkey }
  })
}
