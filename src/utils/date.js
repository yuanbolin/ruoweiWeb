import moment from 'moment'

/*utc时间是指用字母T分割日期，时间后面加上字母Z
  例如 2020-09-25T03:27:26Z
  utc时间+08小时表示北京时间*/

// 将后端传入的时间格式转化为 YYYY-MM-DD HH:mm:ss 格式
function utcToDateTime(dateTime) {
  return moment(dateTime).format('YYYY-MM-DD HH:mm:ss')

  //将后端传入的utc时间格式转化为 YYYY-MM HH:mm 格式  format('YYYY-MM HH:mm')
  //将后端传入的utc时间格式转化为 MM-DD 格式  format('MM-DD')
  //将后端传入的utc时间格式转化为 08:54 时:分 格式  format('LT')
  //将后端传入的utc时间格式转化为 08:54:29 时:分:秒 格式  format('LTS')
  //将后端传入的utc时间格式转化为  2020/09/08 年/月/日 格式  format('L')
  //将后端传入的utc时间格式转化为  2020年9月8日 格式   format('LL')
}

// 判断日期时间是moment对象还是dateString字符串
function isMoment(date) {
  if (date instanceof Object) {
    /* eslint no-underscore-dangle: 0 */
    if (date._isAMomentObject) {
      //判断是否是Moment对象
      return true
    }
    return false
  }
  return false
}

//将前端日期时间转化成utc格式传给后端
function dateToUtcTime(date) {
  if (isMoment(date)) {
    // 如果日期时间为moment对象，可直接调用moment的方法
    return date.utc().format() //转化成utc时间格式（相差8个小时）
  }

  return moment.utc(date).format() // 日期时间为字符串格式，转化后的utc时间为正常时间（不相差8个小时）
}

//将前端日期时间转化成'YYYY-MM-DD T HH:mm:ss+08:00'格式传给后端
function dateToNow(dateString) {
  // 前端日期格式为字符串格式
  return moment(dateString).format()
}

//后端传入字符串格式 ‘YYYY-MM-DD HH:mm:ss’或‘20120203 080205’ 前端经过moment转化后的值，组件可直接使用
function stringToDate(string) {
  return moment(string)
}

//前端要传字符串时间格式，组件传值dateString即可
//注：DatePicker输出dateString ： ’yyyy-mm-dd’
//   MonthPicker输出dateString :  ‘yyyy-mm’
//   WeekPicker输出dateString :   ‘yyyy-xx周’
//   RangerPicker输出dateString为数组格式：["2020-09-07", "2020-10-05"]
//                date也为数组格式：[ {moment} , {moment} ]

// 适用于RangerPicker,当后端传入参数为数组格式时使用，数组内的时间格式可以为字符串、utc格式
function arrayToDate(date) {
  if (date instanceof Array) {
    //判断传入的值是否为数组
    let range = []
    let startTime = moment(date[0])
    let endTime = moment(date[1])
    range.push(startTime, endTime)
    return range //转化后的值RangerPicker可直接使用
  }
  return null
}

// date转换为utc （截止时间）
function dateToUTC(date) {
  return moment(date)
    .hour(+24)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toISOString() // 2019-03-20T16:00:00.000Z    时分秒 取 0
}

// date转换为utc （开始时间）
function dateToUTCForstart(date) {
  return moment(date)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toISOString() // 2019-03-20T16:00:00.000Z    时分秒 取 0
}

export { dateToNow, dateToUtcTime, utcToDateTime, stringToDate, arrayToDate, dateToUTC, dateToUTCForstart }
export default ''
