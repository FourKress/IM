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
    const weekStartTime = dayjs().startOf('week').add(1, 'day').valueOf();
    const weekStr = weekStartTime > timestamp ? '上周' : '周';
    const week = ['日', '一', '二', '三', '四', '五', '六'];
    return `${weekStr}${week[dayjs(timestamp).weekday()]} ${hoursTime}`;
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

export const calculateAgeByBirthday = (birthday) => {
  if (!birthday) return;
  const birthdayYear = dayjs(birthday).year();
  const nowYear = dayjs().year();
  return (nowYear - birthdayYear).toString();
};

const formatTime = (time) => {
  return time < 10 ? `0${time}` : time;
};
//秒转化成 时分秒
export const secondToDate = (time) => {
  if (!time) return '';
  const h = Math.floor(time / 3600);
  const m = Math.floor((time / 60) % 60);
  const s = Math.floor(time % 60);
  if (h) {
    return `${formatTime(h)}:${formatTime(m)}:${formatTime(s)}`;
  }
  return `${formatTime(m)}:${formatTime(s)}`;
};
