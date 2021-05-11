import sortText from './sortText'
import sortFloat from './sortFloat'
import sortBool from './sortBool'
import sortTextArray from './sortTextArray'

const customSortTypes = {
  text: sortText,
  float: sortFloat,
  bool: sortBool,
  textArray: sortTextArray,
}

export default customSortTypes
