module.exports = [
  {},
  {},
  {
    'key1': 'asdfadsf asdfasdf      ',
    'key2': 'value1  ',
  },
  {
    'key1': 'value3\n\n\n',
    'key2': 'value4\t\t\t',
  },
  {
    'key1': 'value5\r\r\r',
    'key2': 'value6' + String.fromCharCode(160) + String.fromCharCode(160),
  },
  {
    'key1': 'value7   ',
    'key2': 'value8' + String.fromCharCode(8203) + String.fromCharCode(8203),
  },
]
