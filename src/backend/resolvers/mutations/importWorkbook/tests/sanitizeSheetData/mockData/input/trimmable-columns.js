module.exports = [
  {},
  {},
  { 'asdf    ': true }, // regular spaces
  { 'asdfkjl    ': 'test' }, // tabs
  { 'x\t\t\t\t\t\t': [] }, // tabs in diff format
  { 'asdf\n\n\n\n': 5 }, // newlines
  { 'asdf\r\r\r\r': 5 }, // carriage returns
  { [`unicodeTrailing1${String.fromCharCode(160)}`]: {} }, // unicode non-breaking space
  { [`unicodeTrailing2${String.fromCharCode(8203)}`]: {} }, // unicode zero-width space
]
