export function getTitleText(title: number): string {
  if (title === 1) {
    return '助教'
  }
  if (title === 2) {
    return '讲师'
  }
  if (title === 3) {
    return '副教授'
  }
  if (title === 4) {
    return '教授'
  }
  return ''
}

export function getGenderText(gender: number): string {
  return gender === 1 ? '男' : '女'
}


export function getAttendanceStatusText(status: number): string {
  if (status === 10) {
    return '出勤'
  }
  if (status === 20) {
    return '缺勤'
  }
  if (status === 30) {
    return '迟到'
  }
  return ''
}
