module.exports = ({ businessObjectName, configs }) => {
  const innerPqls = configs.map(({
    key,
    options,
  }) => {
    return getInnerPqlFromOptions(key, options)
  })

  const combinedInnerPql = innerPqls.join(' AND ') // ! Placard view only supports AND statements

  return `${businessObjectName}={${ combinedInnerPql }}`
}

const getInnerPqlFromOptions = (key, options) => {
  const formattedOptions = options
    .map(({ label }) => `"${label}"`)
    .join(', ')

  return `${ key }=(${ formattedOptions })`
}
