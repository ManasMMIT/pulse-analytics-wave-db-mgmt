const { zonedTimeToUtc } = require('date-fns-tz')
const DEFAULT_TIMEZONE = require('../../../../../../../../../../utils/defaultTimeZone')

module.exports = [
  {
    "timestamp": null,
  },
  {
    "timestamp": zonedTimeToUtc("2020-01-21", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2018-10-30", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2019-03-01", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2017-05-01", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2017-05-01", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2017-05-01", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2016-12-08", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2020-12-31", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2012-04-02", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2011-02-01", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2011-02-01", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2020-02-15", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2019-07-17", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2019-06-01", DEFAULT_TIMEZONE).getTime(),
  },
  {
    "timestamp": zonedTimeToUtc("2019-06-01", DEFAULT_TIMEZONE).getTime(),
  },
]
