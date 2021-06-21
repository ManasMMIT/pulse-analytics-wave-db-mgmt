// grabbed from https://stackoverflow.com/questions/36129721/convert-number-to-alphabet-letter

const COLUMN_LETTER_MAP = {
  person_id: 'M',
  category_id: 'N',
  characteristic_id: 'O',
  regimen_id: 'P',
  product_id: 'Q',
  manufacturer_id: 'R',
}


module.exports = columnName => COLUMN_LETTER_MAP[columnName]
