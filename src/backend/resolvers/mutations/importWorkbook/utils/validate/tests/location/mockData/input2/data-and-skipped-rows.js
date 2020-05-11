const dataAndSkippedRows = {
  result: [],
  skippedRows: [2, 3],
}

for (let i = 0; i < 100; i++) {
  dataAndSkippedRows.result.push({
    "location": "One Pennsylvania Plaza, Suite 2505, New York, NY 10119",
    "index": i, // just to make the docs not exact duplicates; don't want to trigger dupe error
  })
}
  
module.exports = dataAndSkippedRows
