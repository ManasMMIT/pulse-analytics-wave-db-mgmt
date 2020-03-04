// #getVal takes in an object and an arbitrary number of objKeys as strings, and
// iteratively goes deeper into the object if it's nested until either:
// A) All the objKeys 'clear', at which point the bottom value is returned.
// OR
// B) One of the objKeys in the keychain breaks, at which point the error is caught
//    and logged with a message stating the point of breakage for which object.
//    Undefined is then returned.

const getVal = (object, objKeys, defaultVal) => {
  let temp = object
  const workingKeys = []
  let i = 0

  while (i < objKeys.length) {
    try {
      temp = temp[objKeys[i]] // if temp[objKeys[i]] breaks, next two lines won't execute
      workingKeys.push(objKeys[i])
      i += 1
    } catch (e) {
      break
    }
  }

  // if the index doesn't come out to the length of objKeys,
  // then the keychain must've broke
  if (i < objKeys.length) {
    const keyThatBroke = objKeys[i]
    const workingKeysString = workingKeys.map(key => `'${ key }'`).join(' ⟶ ')
    const keyStack = `${ workingKeysString } -/-> '${ keyThatBroke }'`
    // console.error(
    //   'Keychain broke as follows:', keyStack,
    //   // 'for following object:', object
    // )
    return defaultVal
  }

  // in cases where the last key in the keychain returns
  // undefined, log the potential problem and return defaultVal
  if (typeof temp === 'undefined') {
    // console.error(
    //   'Warning: Default value being used because array\'s last key',
    //   `'${ workingKeys[workingKeys.length - 1] }'`,
    //   'returned undefined'
    //    // for following object:, object
    // )
    return defaultVal
  }

  return temp
}

module.exports = getVal
