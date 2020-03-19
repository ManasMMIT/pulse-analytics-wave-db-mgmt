export const generatePqlString = filterConfig => {
  const result = Object.entries(filterConfig).reduce((objString, entry, idx) => {
    const isLastEntry = idx === (Object.keys(filterConfig).length - 1)

    const [label, fields] = entry

    const fieldStrings = Object.entries(fields).reduce((strings, entry) => {
      const [key, values] = entry

      let keyStr
      if (values.length > 0) {
        const valuesStr = values.map(value => `"${ value }"`).join(', ')
        keyStr = `${ key }=(${ valuesStr })`
      } else {
        keyStr = `${ key }=()`
      }

      if (!isLastEntry) keyStr += ' AND '

      strings.push(keyStr)
      return strings
    }, [])
    
    const joinedFields = fieldStrings.join(' AND ')

    objString += (`${ label }={${ joinedFields }}`)

    return objString
  }, '')

  return result
}

export default generatePqlString