export function useBookingFun() {
  const formatDate = (dateData) => {
    const date = new Date(dateData);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ];
    const weekday = weekdays[date.getDay()];
    return `${month} 月 ${day} 日 ${weekday}`;
  };
  return {
    formatDate,
  };
}
