import request from '@/utils/request'

export function API_getScene(userkey) {
  return request({
    url: '/AppClientAction_findSceneByUser.do',
    method: 'get',
    params: { userkey }
  })
}
export function API_getSwitchByUser(userkey) {
  return request({
    url: '/AppClientAction_getSwitchByUser.do',
    method: 'get',
    params: { userkey }
  })
}
