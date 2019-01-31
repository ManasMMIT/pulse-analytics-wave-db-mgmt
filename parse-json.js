const fs = require('fs')

const parseJson = (filePath) => {
  let data

  try {
    const rawData = fs.readFileSync(filePath, 'utf8')
    data = JSON.parse(rawData)
  } catch (e) {
    console.error('Error parsing JSON file:', e)
    process.exit()
  }

  return data
}

module.exports = parseJson
