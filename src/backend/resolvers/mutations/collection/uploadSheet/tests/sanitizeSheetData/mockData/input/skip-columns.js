module.exports = [
  {},
  {},
  { '': true }, // regular spaces
  { '         ': 'test' }, // tabs
  { '\t\t\t\t\t\t': [] }, // tabs in diff format
  { '\n\n\n\n': 5 }, // newlines
  { '\r\r\r\r': 5 }, // carriage returns
  { [String.fromCharCode(160)]: {} }, // unicode non-breaking space
  { [String.fromCharCode(8203)]: {} }, // unicode zero-width space
]
