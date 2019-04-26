import request from '@/utils/request'

export function API_PointUsed(sw1, array1, strTime) {
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
  return request({
    url: '/get/point_used',
    method: 'get',
    params: {
      param_1,
      param_2,
      startTime: strTime[0].getTime(),
      endTime: strTime[1].getTime()
    }
  })
}
