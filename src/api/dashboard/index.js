import request from '@/utils/request'

export function API_GetCalendarData(mTime) {
  return request({
    url: '/dashboard/calendarData',
    method: 'get',
    params: {
      time: mTime.getTime()
    }
  })
}

export function API_GetPieChartData(mTime, type) {
  return request({
    url: '/dashboard/pieChartData',
    method: 'get',
    params: {
      time: mTime.getTime(),
      type: type
    }
  })
}
