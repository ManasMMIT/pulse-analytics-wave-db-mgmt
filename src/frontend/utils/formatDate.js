import format from 'date-fns/format'

export const formatDateTime = str => format(new Date(str), 'M/d/yy, h:mm:ss a')

export const formatDayMonthYearShort = str => format(new Date(str), 'M/d/yy')
