import request from '@/utils/request'

export function API_getCollector(userkey) {
  return request({
    url: 'AppClientAction_getCollector.do',
    method: 'get',
    params: { userkey }
  })
}
export function API_findSignalsType(userkey, type) {
  return request({
    url: 'AppClientAction_findSignalsType.do',
    method: 'get',
    params: { userkey, type }
  })
}
export function API_getSwitchByCollector(userkey, collectorCode) {
  return request({
    url: 'AppClientAction_getSwitchByCollector.do',
    method: 'get',
    params: { userkey, collectorCode }
  })
}
export function API_getSignalByDay(userkey, switchID, signalsTypeID, time) {
  return request({
    url: 'AppClientAction_getSignalByDay.do',
    method: 'get',
    params: { userkey, switchID, signalsTypeID, time }
  })
}
