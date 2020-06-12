const { ObjectId } = require('mongodb')
const _ = require('lodash')

const getEnrichedModalAggPipeline = require('./getEnrichedModalAggPipeline')

const COMPONENT_TYPE_TO_HTML_INPUT_TYPE = {
  Select: 'string', // ! THIS HAS NO EFFECT FOR REACT-SELECT; see util in src/frontend/components/FieldsSectionCard/utils.js
  TextInput: 'text',
  DateInput: 'date',
  EmailInput: 'email',
  NumberInput: 'number',
  RangeInput: 'range',
  TimeInput: 'time',
  CheckboxInput: 'checkbox',
}

const getMergedSchema = (enrichedModalConfig, boDocs) => {
  const { boFieldsRef, sourceCollection, ...rest } = enrichedModalConfig

  const clonedModalConfig = _.cloneDeep(rest)

  const boFieldsRefByIds = _.keyBy(boFieldsRef, '_id')

  clonedModalConfig.tags.forEach(({ sections }) => {
    return sections.forEach(({ fields }) => {
      return fields.forEach(field => {
        const {
          // type, // arbitrarily avoid using boField's type for now in favor of using COMPONENT_TYPE_TO_HTML_INPUT_TYPE
          key,
        } = boFieldsRefByIds[field.boFieldId.toString()]

        field.inputProps = _.merge(
          {},
          { type: COMPONENT_TYPE_TO_HTML_INPUT_TYPE[field.inputComponent] || 'string' },
          field.inputProps,
        )

        field.key = key

        if (field.inputComponent === 'Select') {
          // ? if select depends on data, then options will be empty;
          // ? otherwise, options should've been hardcoded
          if (_.isEmpty(field.inputProps.options)) {
            const selectValues = _.uniqBy(boDocs, key).map(({ [key]: targetValue }) => targetValue)
            field.inputProps.options = _.compact(selectValues)
          }
        }
      })
    })
  })

  return clonedModalConfig
}

const bomSchema = async (parent, { boId }, { pulseCoreDb }) => {
  boId = ObjectId(boId)

  const enrichedModalAggPipeline = getEnrichedModalAggPipeline(boId)

  // 1. Get everything we need by mashing together bus. obj. and its modal config.
  const enrichedModalConfig = await pulseCoreDb.collection('businessObjects.modals')
    .aggregate(enrichedModalAggPipeline)
    .next()

  // 2. Grab the entire bus obj's data for filling in options if needed
  const businessObjectDocs = await pulseCoreDb
    .collection(enrichedModalConfig.sourceCollection.collection)
    .find(enrichedModalConfig.sourceCollection.query || {})
    .toArray()

  // 3. Merge business object fields with modal fields
  const bomSchemaObj = getMergedSchema(enrichedModalConfig, businessObjectDocs)

  return bomSchemaObj
}

module.exports = bomSchema
