import request from '@/utils/request'

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
