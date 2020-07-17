const fetch = require('node-fetch')
const _ = require('lodash')

const FIELDS_RAW = [
  'date_of_payment',
  'total_amount_of_payment_usdollars',
  'applicable_manufacturer_or_applicable_gpo_making_payment_name',
  'product_category_or_therapeutic_area_1',
  'name_of_drug_or_biological_or_device_or_medical_supply_1',
  'product_category_or_therapeutic_area_2',
  'name_of_drug_or_biological_or_device_or_medical_supply_2',
  'product_category_or_therapeutic_area_3',
  'name_of_drug_or_biological_or_device_or_medical_supply_3',
  'product_category_or_therapeutic_area_4',
  'name_of_drug_or_biological_or_device_or_medical_supply_4',
  'nature_of_payment_or_transfer_of_value',
  'recipient_primary_business_street_address_line1',
  'recipient_primary_business_street_address_line2',
  'recipient_city',
  'recipient_state',
  'recipient_zip_code',
  'physician_primary_type',
  'physician_specialty',
]

const SELECTED_FIELDS = FIELDS_RAW.map(
  (field) => `${field} AS ${_.camelCase(field)}`
).join(', ')

// ! limit is set to max the API will allow and is necessary,
// ! or results are throttled to 1K.
const MAX_DATA_LENGTH = 50000
const DATA_SET_KEY = 'p2ve-2ws5'
const URI_ROOT = `https://openpaymentsdata.cms.gov/resource/${DATA_SET_KEY}.json`

const getQueryString = (physicianProfileId) =>
  `?physician_profile_id=${physicianProfileId}&$select=${SELECTED_FIELDS}&$limit=${MAX_DATA_LENGTH}`

module.exports = (parent, { physicianProfileId }) => {
  const queryString = getQueryString(physicianProfileId)

  const fullURI = URI_ROOT + queryString

  return fetch(fullURI).then((res) => res.json())
}
