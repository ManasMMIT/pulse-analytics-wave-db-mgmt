/*
SANITIZATION RULES:
- Always skip the first two incoming rows (assume the two rows after the headers are metadata)
- If a row has a truthy value for the 'skip' key, it is skipped
- If a row has a falsey value for the 'skip' key, the skip key/vale pair is not persisted (treated as a metadata marker)
- All column names (keys) are trimmed
- If a column's name is an empty string and/or consists of unicode character(s) trimmable to an empty string, the entire column and its values are skipped
- If a column's name contains the exact phrase '__EMPTY' in it, the entire column and its values are skipped
- If the value corresponding to a key is falsey but not literally false, it is coerced into null
- All keys, if not in (lowerCamelCase)[https://wiki.c2.com/?LowerCamelCase], are coerced to lowerCamelCase except for '_id'
- All values are trimmed if they're strings
- If a row's values are all non-false falsey values, it is skipped
*/
const sanitize = require('../../utils/sanitize')

const twoRowsInput = require('./mockData/input/two-rows')
const twoRowsOutput = require('./mockData/output/two-rows')

const onlySkipsInput = require('./mockData/input/only-skips')
const onlySkipsOutput = require('./mockData/output/only-skips')

const falseySkipsInput = require('./mockData/input/falsey-skips')
const falseySkipsOutput = require('./mockData/output/falsey-skips')

const mixedSkipsInput = require('./mockData/input/mixed-skips')
const mixedSkipsOutput = require('./mockData/output/mixed-skips')

const trimmableColumnsInput = require('./mockData/input/trimmable-columns')
const trimmableColumnsOutput = require('./mockData/output/trimmable-columns')

const skipColumnsInput = require('./mockData/input/skip-columns')
const skipColumnsOutput = require('./mockData/output/skip-columns')

const skipEmptyColumnsInput = require('./mockData/input/skip-empty-columns')
const skipEmptyColumnsOutput = require('./mockData/output/skip-empty-columns')

const coerceFalseyValuesToNullInput = require('./mockData/input/coerce-values-to-null')
const coerceFalseyValuesToNullOutput = require('./mockData/output/coerce-values-to-null')

const mixedBagRawDataInput = require('./mockData/input/program-overview-raw-data')
const mixedBagRawDataOutput = require('./mockData/output/sanitized-program-overview')

const coerceToCamelCaseInput = require('./mockData/input/coerce-to-camelCase')
const coerceToCamelCaseOutput = require('./mockData/output/coerce-to-camelCase')

const trimValuesInput = require('./mockData/input/trim-values')
const trimValuesOutput = require('./mockData/output/trim-values')

const skipBlankRowsInput = require('./mockData/input/skip-blank-rows')
const skipBlankRowsOutput = require('./mockData/output/skip-blank-rows')

test('Skip first two incoming rows (assume they\'re metadata)', () => {
  const sanitizedData = sanitize(twoRowsInput)
  expect(sanitizedData).toStrictEqual(twoRowsOutput)
})

test('Skip rows with truthy value for "skip" key', () => {
  const sanitizedData = sanitize(onlySkipsInput)
  expect(sanitizedData).toStrictEqual(onlySkipsOutput)
})

test('Keep rows with falsey values for "skip" key but delete the skip key/values pairs', () => {
  const sanitizedData = sanitize(falseySkipsInput)
  expect(sanitizedData).toStrictEqual(falseySkipsOutput)
})

test('Combo: Skip rows with truthy values; keep rows with falsey values', () => {
  const sanitizedData = sanitize(mixedSkipsInput)
  expect(sanitizedData).toStrictEqual(mixedSkipsOutput)
})

test('Trim all column names, including for unicode whitespace characters', () => {
  const sanitizedData = sanitize(trimmableColumnsInput)
  expect(sanitizedData).toStrictEqual(trimmableColumnsOutput)
})

test('Skip all column names trimmable to an empty space', () => {
  const sanitizedData = sanitize(skipColumnsInput)
  expect(sanitizedData).toStrictEqual(skipColumnsOutput)
})

test('Skip all columns containing keyword __EMPTY', () => {
  const sanitizedData = sanitize(skipEmptyColumnsInput)
  expect(sanitizedData).toStrictEqual(skipEmptyColumnsOutput)
})

test('Coerce falsey non-null values to null except for false', () => {
  const sanitizedData = sanitize(coerceFalseyValuesToNullInput)
  expect(sanitizedData).toStrictEqual(coerceFalseyValuesToNullOutput)
})

test("Coerce keys to lowerCamelCase except for '_id'", () => {
  const sanitizedData = sanitize(coerceToCamelCaseInput)
  expect(sanitizedData).toStrictEqual(coerceToCamelCaseOutput)
})

test('Trim values if they\'re strings', () => {
  const sanitizedData = sanitize(trimValuesInput)
  expect(sanitizedData).toStrictEqual(trimValuesOutput)
})

test('Skip blank rows (if a row\'s values are all non-false falsey values)', () => {
  const sanitizedData = sanitize(skipBlankRowsInput)
  expect(sanitizedData).toStrictEqual(skipBlankRowsOutput)
})

test('Successfully sanitize real sample of raw data (mixed impurities)', () => {
  const sanitizedData = sanitize(mixedBagRawDataInput)
  expect(sanitizedData).toStrictEqual(mixedBagRawDataOutput)
})
