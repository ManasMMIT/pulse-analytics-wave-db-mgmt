const fs = require('fs')
const inquirer = require('inquirer')
const _ = require('lodash')
const XLSX = require('xlsx')
const connectToMongoDb = require('../connect-to-mongodb')
const {
  isEmptyRow,
  sanitizeKeysAndTrimData,
  getScriptTerminator
} = require('../utils')
const parseSchema = require('mongodb-schema')

const convertToJson = sheet => {
  const json = XLSX.utils.sheet_to_json(sheet, { blankrows: true })

  // remove the second and third rows from the json
  const jsonWithFirstTwoRowsRemoved = json.slice(2)
  const numberOfDataRows = jsonWithFirstTwoRowsRemoved.length

  const formattedData = jsonWithFirstTwoRowsRemoved.reduce((acc, row) => {
    const sanitizedRow = sanitizeKeysAndTrimData(row)
    if (isEmptyRow(sanitizedRow)) return acc

    acc.push(sanitizedRow)
    return acc
  }, [])

  const numExcludedRows = numberOfDataRows - formattedData.length

  return { json: formattedData, numExcludedRows }
}

const fileExists = filepath => {
  try {
    return fs.statSync(filepath).isFile()
  } catch (err) {
    return false
  }
}

function askForExcelFilepath() {
  const question = {
    type: 'input',
    name: 'filepath',
    message: 'What\'s the filepath of the Excel file?',
  }

  inquirer.prompt(question).then(({ filepath }) => {
    let trimmedPath = filepath.replace(/\\/g, '').trim()

    // If file doesn't exist, terminate the script
    if (!fileExists(trimmedPath)) {
      console.log('File does not exist.')
      process.exit()
    }

    const workbook = XLSX.readFile(trimmedPath)
    askForSheet(workbook)
  })
}

function askForSheet(workbook) {
  const sheetNames = workbook.SheetNames

  const sheetQuestion = {
    type: 'list',
    name: 'sheetName',
    message: 'Pick the sheet you\'d like to upload',
    choices: sheetNames,
  }

  inquirer.prompt(sheetQuestion).then(({ sheetName }) => {
    const selectedSheetObj = workbook.Sheets[sheetName]
    askForCollectionName(selectedSheetObj)
  });
}

async function askForCollectionName(selectedSheetObj) {
  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseRawDb = await mongoConnection.db('test')

  const question = {
    type: 'list',
    name: 'collectionEntryMethod',
    message: 'Pick how you\'d like to upload the sheet to pulse-raw.',
    choices: [
      'Manually enter a collection name',
      'Scan existing collections and pick one with similar keys',
    ],
  }

  inquirer.prompt(question).then(({ collectionEntryMethod }) => {
    if (collectionEntryMethod === 'Manually enter a collection name') {
      manullyEnterCollection({ selectedSheetObj, terminateScript, pulseRawDb })
    } else {
      scanCollectionsAndPick({ selectedSheetObj, terminateScript, pulseRawDb })
    }
  })
}

function manullyEnterCollection({ selectedSheetObj, terminateScript, pulseRawDb }) {
  const question = {
    type: 'input',
    name: 'collectionName',
    message: 'What\'s the collection name?',
  }

  inquirer.prompt(question).then(async ({ collectionName }) => {
    const collections = await pulseRawDb.listCollections({ name: collectionName }).toArray()

    if (collections.length > 0) {
      console.log('Collection already exists. Deleting existing data and replacing...')
    } else {
      console.log('Collection doesn\'t currently exist. Importing as new collection...')
    }

    const { json, numExcludedRows } = convertToJson(selectedSheetObj)
    console.log(`${numExcludedRows} rows excluded after sanitization`)

    await pulseRawDb.collection(collectionName).deleteMany()
    await pulseRawDb.collection(collectionName).insertMany(json)

    console.log('Collection uploaded.')
    await terminateScript()
  })
}

async function scanCollectionsAndPick({ selectedSheetObj, terminateScript, pulseRawDb }) {
  const { json, numExcludedRows } = convertToJson(selectedSheetObj)
  console.log('Parsing sheet for headers and sanitizing...')
  console.log(`${numExcludedRows} rows excluded after sanitization`)

  const headers = Object.keys(json[0])

  const topMatchingCollections = await getTopMatchingCollections(pulseRawDb, headers)

  const question = {
    type: 'list',
    name: 'collectionName',
    message: 'These five collections have the most similar keys. Pick a collection to replace:',
    choices: topMatchingCollections,
  }

  inquirer.prompt(question).then(async ({ collectionName }) => {
    await pulseRawDb.collection(collectionName).deleteMany()
    await pulseRawDb.collection(collectionName).insertMany(json)

    console.log('Collection uploaded.')
    await terminateScript()
  })
}

async function getTopMatchingCollections(pulseRawDb, headers) {
  const collections = await pulseRawDb.listCollections().toArray()
  const numOfCollections = collections.length

  let xorRecord = []
  let i = 0

  console.log(`Scanning ${numOfCollections} collections for similar keys...`)

  const schemaPromises = collections.map(({ name: collectionName }) => {
    const collectionCursor = pulseRawDb.collection(collectionName).find()

    const processSchema = new Promise((resolve, reject) => {
      parseSchema(collectionCursor, (err, schema) => {
        if (err) {
          reject(err)
          return
        }

        const schemaFields = schema.fields.map(({ name }) => name)
          .filter(str => str !== '_id')

        const numOfDiffKeys = _.xor(schemaFields, headers).length
        const scoreObj = { score: numOfDiffKeys, collectionName }
        xorRecord.push(scoreObj)

        process.stdout.clearLine();
        process.stdout.write(`~~~~~ ${++i}/${numOfCollections} collections scanned ~~~~~`);
        process.stdout.cursorTo(0);

        resolve()
      })
    })

    return processSchema
  })

  await Promise.all(schemaPromises)

  const sortedRecord = _.sortBy(xorRecord, 'score')
    .slice(0, 5)
    .map(({ collectionName }) => collectionName)

  return sortedRecord
}

askForExcelFilepath()
