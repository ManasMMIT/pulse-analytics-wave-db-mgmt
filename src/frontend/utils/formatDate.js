import format from 'date-fns/format'
import { zonedTimeToUtc } from 'date-fns-tz'

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
  Usage of zonedTimeToUtc here is the same as what's used on the backend to resolve timezone issues.

  If you don't use this util to convert ISO short into a Date object, JS Date object by default
  initializes ISO short format into the local timezone equivalent of UTC time, so
  '2020-10-01' === '9/30/2020, 8:00:00 PM' (4 hours off), and confusingly, due to daylight savings time,
  you'll find that new Date('2020-12-01') === '11/30/2020, 7:00:00 PM' (5 hours off). This means
  trying to add a timezone manually like:

  new Date(SHORT_ISO_FORMAT + 'T00:00:00.000-04:00')

  isn't going to work because you can't hardcode the offset. The code below handles this
  by dynamically calculating the offset for whatever ISO short is passed in.
*/
export const convertIsoShortToDateObj = (isoShortString) =>
  zonedTimeToUtc(isoShortString, 'America/New_York')

export const isoShortToDateMonthYearLong = (isoShortString) =>
  format(convertIsoShortToDateObj(isoShortString), 'MMMM do, yyyy')

export const isoShortToYearQuarter = (isoShortString) =>
  format(convertIsoShortToDateObj(isoShortString), "yyyy 'Q'Q")
