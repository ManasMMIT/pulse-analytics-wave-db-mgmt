import format from 'date-fns/format'

export const formatDateTime = (str) =>
  format(new Date(str), 'M/d/yy, h:mm:ss a')

export const formatDayMonthYearShort = (str) => format(new Date(str), 'M/d/yy')

export const formatDateTimeDotted = (str) =>
  format(new Date(str), 'M.d.yy_h.mm.ssa')

export const formatDateMonthYearLong = (str) =>
  format(new Date(str), 'MMMM do, yyyy')

export const formatDateMonthYearDash = (str) =>
  format(new Date(str), 'yyyy-MM-dd')

/*
Util below adapted from: https://stackoverflow.com/a/57842203

If you don't use this util to convert ISO short into a Date object, Date object by default
initializes ISO short format into the local timezone equivalent of UTC time, so
'2020-10-01' === '9/30/2020, 8:00:00 PM' (4 hours off), and confusingly, due to daylight savings time,
you'll find that new Date('2020-12-01') === '11/30/2020, 7:00:00 PM' (5 hours off). This means
trying to add a timezone manually like:

new Date(SHORT_ISO_FORMAT + 'T00:00:00.000-04:00')

isn't going to work because you can't hardcode the offset. The code below handles this
by dynamically calculating the offset for whatever ISO short is passed in and then
using that to `setTime` on the date object.
*/
export const convertIsoShortToDateObj = (isoShortString) => {
  const [year, month, day] = isoShortString.split('-').map(Number)

  // ! account for zero-indexed month by subtracting one from month
  const date = new Date(Date.UTC(year, month - 1, day))

  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(
    date.toLocaleString('en-US', { timeZone: 'America/New_York' })
  )
  const offset = utcDate.getTime() - tzDate.getTime()

  date.setTime(date.getTime() + offset)

  return date
}

export const formatYearQuarter = (isoShortString) =>
  format(convertIsoShortToDateObj(isoShortString), "yyyy 'Q'Q")
