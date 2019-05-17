import request from '@/utils/request'

export function API_getCollector(userkey) {
  return request({
    url: '/AppClientAction_getCollector.do',
    method: 'get',
    params: { userkey }
  })
}
export function API_collectorBinding(userkey, collectorCode) {
  return request({
    url: '/AppClientAction_bindingWithCollector.do',
    method: 'get',
    params: {
      userkey,
      collectorCode
    }
  })
}
export function API_collectorShare(userkey, collectorID, username, enable) {
  return request({
    url: '/AppClientAction_shareCollectorToUser.do',
    method: 'get',
    params: {
      userkey,
      collectorID,
      username,
      enable
    }
  })
}

export function API_collectorRelieve(userkey, collectorCode) {
  return request({
    url: '/AppClientAction_unbindingWithCollector.do',
    method: 'get',
    params: {
      userkey,
      collectorCode
    }
  })
}

export function API_getSwitchByCollector(userkey, collectorCode) {
  return request({
    url: '/AppClientAction_getSwitchByCollector.do',
    method: 'get',
    params: {
      userkey,
      collectorCode
    }
  })
}
