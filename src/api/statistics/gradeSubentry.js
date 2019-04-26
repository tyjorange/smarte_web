import request from '@/utils/request'

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
