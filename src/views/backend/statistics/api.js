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

export function API_GradeSubentry(collectorID, startTime, endTime, timeType) {
  return request({
    url: '/statistics/gradeSubentry',
    method: 'post',
    params: {
      collectorID,
      startTime,
      endTime,
      timeType
    }
  })
}

export function API_GradeTime(collectorID, time, timeType) {
  return request({
    url: '/statistics/gradeTime',
    method: 'post',
    params: {
      collectorID,
      time,
      timeType
    }
  })
}
