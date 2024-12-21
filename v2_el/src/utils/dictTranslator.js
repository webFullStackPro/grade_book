export const titleMap = {
  1: '助教',
  2: '讲师',
  3: '副教授',
  4: '教授'
};

export function getTitleText(title) {
  return titleMap[title] || '';
}

export function getGenderText(gender) {
  return gender === 1 ? '男' : '女'
}

export const attendanceStatusMap = {
  10: '出勤',
  20: '缺勤',
  30: '迟到'
};

export function getAttendanceStatusText(status) {
  return attendanceStatusMap[status] || '';
}
