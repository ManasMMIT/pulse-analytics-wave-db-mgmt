const getGeocodingData = require('./getGeocodingData')

const addLocationCustomKeyword = ajv => ajv.addKeyword('validateLocation', {
  async: true,
  modifying: true,
  compile: (schema, parentSchema, it) => {
    return async (data, dataPath, parentData, parentKey) => {
      const geocodingResult = await getGeocodingData(data)

      if (geocodingResult) {
        parentData.__SIDE_EFFECT_DATA = geocodingResult
      }

      return Boolean(geocodingResult)
    }
  }
})

module.exports = addLocationCustomKeyword
