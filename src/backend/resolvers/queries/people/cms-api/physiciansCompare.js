const fetch = require('node-fetch')

const SELECTED_FIELDS = [
  'frst_nm AS firstName',
  'mid_nm AS middleName',
  'lst_nm AS lastName',
  'ind_pac_id AS pacId',
  'ind_enrl_id AS professionalEnrollmentId',
  'pri_spec AS primarySpecialty',
  'sec_spec_1 AS secondarySpecialty1',
  'sec_spec_2 AS secondarySpecialty2',
  'sec_spec_3 AS secondarySpecialty3',
  'sec_spec_4 AS secondarySpecialty4',
  'sec_spec_all AS secondarySpecialtyAll',
  'org_lgl_nm AS orgLegalName',
  'org_pac_id AS groupPracticePacId',
  'adr_ln_1 AS address1',
  'adr_ln_2 AS address2',
  'cty AS city',
  'st AS state',
  'zip',
  'hosp_afl_lbn_1 AS hospitalAffilLbn1',
  'hosp_afl_lbn_2 AS hospitalAffilLbn2',
  'hosp_afl_lbn_3 AS hospitalAffilLbn3',
  'hosp_afl_lbn_4 AS hospitalAffilLbn4',
  'hosp_afl_lbn_5 AS hospitalAffilLbn5',
].join(', ')

// ! limit is set to max the API will allow and is necessary,
// ! or results are throttled to 1K.
const MAX_DATA_LENGTH = 50000

const getURI = (npi) =>
  `https://data.medicare.gov/resource/mj5m-pzi6.json?npi=${npi}&$select=${SELECTED_FIELDS}&$limit=${MAX_DATA_LENGTH}`

module.exports = (parent, { npi }) => {
  const URI = getURI(npi)

  return fetch(URI).then((res) => res.json())
}
