import request from '@/utils/request'

export function API_GetCollectors(token) {
  return request({
    url: '/get/fsu/collectors',
    method: 'get',
    params: {
      token
    }
  })
}

export function API_GetSwitchs(collectorId) {
  return request({
    url: '/get/switchs',
    method: 'get',
    params: {
      collectorId
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

export function API_GetSignals(sw1, array1, array2, array3) {
  var param_1 = ''
  var param_2 = ''
  sw1.forEach(element => {
    param_1 += element.switchid + ','
  })
  array1.forEach(element => {
    param_2 += element.id + ','
  })
  array2.forEach(element => {
    param_2 += element.id + ','
  })
  array3.forEach(element => {
    param_2 += element.id + ','
  })
  return request({
    url: '/get/signal_news',
    method: 'get',
    params: {
      param_1,
      param_2
    }
  })
}
