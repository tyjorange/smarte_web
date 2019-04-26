import request from '@/utils/request'

export function API_GetCollectors(token) {
  return request({
    url: '/get/collectors',
    method: 'get',
    params: {
      token
    }
  })
}

export function API_GetCollectorTree(token) {
  return request({
    url: '/get/fsu/collectorTree',
    method: 'get',
    params: {
      token
    }
  })
}

export function API_getAllSwitchs(token) {
  return request({
    url: '/get/allSwitchs',
    method: 'get',
    params: {
      token
    }
  })
}

export function API_GetSwitchs(collectorId) {
  return request({
    url: '/get/collector_switchs',
    method: 'get',
    params: {
      collectorId
    }
  })
}
