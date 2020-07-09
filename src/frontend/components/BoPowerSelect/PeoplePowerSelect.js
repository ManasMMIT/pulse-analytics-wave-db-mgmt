import React from 'react'

import { GET_PEOPLE } from 'frontend/api/queries'

import PeopleModal from 'frontend/components/BusinessObjectModal/PeopleModal'
import BoPowerSelect from 'frontend/components/BoPowerSelect/BoPowerSelect'

const PeoplePowerSelect = () => (
  <BoPowerSelect
    placeholder={'Select Person'}
    getLabel={({ firstName, lastName }) => `${firstName} ${lastName}`}
    queryDoc={GET_PEOPLE}
    Modal={PeopleModal}
  />
)

export default PeoplePowerSelect
