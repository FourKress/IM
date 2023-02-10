import dayjs from 'dayjs';
const weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);

// 1、今日：展示为时：分，如：09:00
// 2、两日内：展示为昨天/前天+时：分，如：昨天 09:00
// 3、两日后—一周内：展示为周几+时：分，如：周一 09:00
// 4、一周后：展示为月/日，如：10月25日
// 5、跨年后，展示为年/月/日，如：2021年12月31日

export const timesTransform = (timestamp) => {
  if (!timestamp) return '';
  const diffDay = dayjs()
    .startOf('day')
    .diff(dayjs(timestamp).startOf('day'), 'day');
  const hoursTime = dayjs(timestamp).format('HH:mm');
  if (diffDay === 0) {
    return hoursTime;
  }
  if (diffDay <= 2) {
    return `${diffDay === 1 ? '昨天' : '前天'} ${hoursTime}`;
  }
  if (diffDay <= 7) {
    const week = ['日', '一', '二', '三', '四', '五', '六'];
    return `周${week[dayjs(timestamp).weekday()]} ${hoursTime}`;
  }
  if (diffDay > 7) {
    const timerYear = dayjs(timestamp).year();
    const currentYear = dayjs().year();
    if (timerYear === currentYear) {
      return dayjs(timestamp).format('MM月DD日');
    }
    return dayjs(timestamp).format('YYYY年MM月DD日');
  }
};

export const checkTimesInterval = (currentTimes, preTimes) => {
  if (currentTimes === preTimes) return true;
  const interval = dayjs(Number(currentTimes)).diff(Number(preTimes), 's');
  return interval >= 300;
};
