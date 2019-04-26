import request from '@/utils/request'

export function API_GetSignalsHis(sw1, array1, array2, array3, strTime, page, limit) {
  var param_1 = ''
  var param_2 = ''
  if (typeof sw1 === 'string') {
    param_1 = sw1
  } else {
    sw1.forEach(element => {
      param_1 += element.switchid + ','
    })
  }
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
    url: '/get/signal_his',
    method: 'get',
    params: {
      param_1,
      param_2,
      startTime: strTime[0].getTime(),
      endTime: strTime[1].getTime(),
      page,
      limit
    }
  })
}
