const fetch = require('node-fetch')
const _ = require('lodash')

// ! limit is set to max the API will allow and is necessary,
// ! or results are throttled to 1K.
const MAX_DATA_LENGTH = 50000
const OPEN_PAYMENTS_APIS =
  'https://openpaymentsdata.cms.gov/resource/ap6w-xznw.json'
const SELECTED_FIELDS = [
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
  .map((field) => `${field} AS ${_.camelCase(field)}`)
  .join(', ')

const removeErrorObjects = (acc, data) =>
  Array.isArray(data) ? acc.concat(data) : acc

const getGetGeneralPaymentOps = (physicianProfileId) => {
  const queryString = `?physician_profile_id=${physicianProfileId}&$select=${SELECTED_FIELDS}&$limit=${MAX_DATA_LENGTH}`

  return (acc, { dataset_name, api_endpoint }) => {
    const isGeneralApi = dataset_name.includes('General Payment')

    if (isGeneralApi) {
      const fullURI = api_endpoint + queryString
      const apiFetch = fetch(fullURI).then((res) => res.json())
      acc.push(apiFetch)
    }

    return acc
  }
}

module.exports = async (parent, { physicianProfileId }) => {
  const allOpenPaymentApis = await fetch(OPEN_PAYMENTS_APIS).then((res) =>
    res.json()
  )
  const getGeneralPaymentOps = getGetGeneralPaymentOps(physicianProfileId)
  const generalPaymentApiOps = allOpenPaymentApis.reduce(
    getGeneralPaymentOps,
    []
  )
  const allGeneralYearsData = await Promise.all(generalPaymentApiOps)
  return allGeneralYearsData.reduce(removeErrorObjects, [])
}
