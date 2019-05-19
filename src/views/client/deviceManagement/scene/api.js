import request from '@/utils/request'

export function API_getScene(userkey) {
  return request({
    url: '/AppClientAction_findSceneByUser.do',
    method: 'get',
    params: { userkey }
  })
}
export function API_getCollector(userkey) {
  return request({
    url: '/AppClientAction_getCollector.do',
    method: 'get',
    params: { userkey }
  })
}
