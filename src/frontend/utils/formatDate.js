import format from 'date-fns/format'

export const formatDateTime = (str) => format(new Date(str), 'M/d/yy, h:mm:ss a')

export const formatDayMonthYearShort = (str) => format(new Date(str), 'M/d/yy')

export const formatDateTimeDotted = (str) => format(new Date(str), 'M.d.yy_h.mm.ssa')

export const formatDateMonthYearLong = (str) => format(new Date(str), 'MMMM do, yyyy')

export const formatDateMonthYearDash = (str) => format(new Date(str), 'M-d-yy')
