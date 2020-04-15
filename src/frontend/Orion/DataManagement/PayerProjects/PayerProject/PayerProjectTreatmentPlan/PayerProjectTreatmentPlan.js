import React from 'react'
import styled from '@emotion/styled'

import Title from '../../../../../components/Title'

import TreatmentPlansFilters from './TreatmentPlansFilters'
import TreatmentPlansTable from './TreatmentPlansTable'

const PAYER_TITLE = 'PAYER TREATMENT PLANS'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  width: '100%',
})

const PayerProjectTreatmentPlan = ({ location, match }) => {
  // ! TODO: Implement dynamic title with project name using project id
  return (
    <Wrapper>
      <section style={{ padding: 12 }}>
        <Title title={PAYER_TITLE} />
      </section>
      <TreatmentPlansFilters />
      <TreatmentPlansTable checkbox />
    </Wrapper>
  )
}

export default PayerProjectTreatmentPlan
