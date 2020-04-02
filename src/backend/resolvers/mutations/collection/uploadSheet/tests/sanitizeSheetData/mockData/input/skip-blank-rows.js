module.exports = [
  {},
  {},
  {
    'key1': '',
    'key2': '',
  },
  {
    'key1': '\n\n\n',
    'key2': '\t\t\t',
  },
  {
    'key1': '\r\r\r',
    'key2': String.fromCharCode(160) + String.fromCharCode(160),
  },
  {
    'key1': '',
    'key2': String.fromCharCode(8203) + String.fromCharCode(8203),
  },
  {
    'key1': null,
    'key2': false,
  },
  {
    'key1': NaN,
    'key2': undefined,
  },
  {
    'key1': '',
    'key2': undefined,
  },
  {
    'key1': null,
    'key2': null,
  },
  {
    'key1': NaN,
    'key2': NaN,
  },
  {
    'key1': false,
    'key2': undefined,
  },
]
