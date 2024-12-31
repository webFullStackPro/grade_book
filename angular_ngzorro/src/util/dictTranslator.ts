export const titleMap: { [key: number]: string } = {
  1: '助教',
  2: '讲师',
  3: '副教授',
  4: '教授'
};
export function getTitleText(title: number): string {
  return titleMap[title] || '';
}

export function getGenderText(gender: number): string {
  return gender === 1 ? '男' : '女'
}
export const attendanceStatusMap: { [key: number]: string } = {
  10: '出勤',
  20: '缺勤',
  30: '迟到'
};
export function getAttendanceStatusText(status: number): string {
  return attendanceStatusMap[status] || '';
}
