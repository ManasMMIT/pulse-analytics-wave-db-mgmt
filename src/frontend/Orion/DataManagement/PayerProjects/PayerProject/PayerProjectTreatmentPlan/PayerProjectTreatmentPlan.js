import React from 'react'
import styled from '@emotion/styled'

import Title from '../../../../../components/Title'
import FieldsSectionCard from '../../../../../components/FieldsSectionCard'

import TreatmentPlansTable from './TreatmentPlansTable'

const PAYER_TITLE = 'PAYER TREATMENT PLANS'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
})

const PayerProjectTreatmentPlan = ({ location, match }) => {
  // ! TODO: Implement dynamic title with project name using project id
  return (
    <Wrapper>
      <section style={{ padding: 12 }}>
        <Title title={PAYER_TITLE} />
      </section>
      <FieldsSectionCard
        label={'Filters Here'}
        containerStyle={{ height: 100 }}
      />
      <TreatmentPlansTable />
    </Wrapper>
  )
}

export default PayerProjectTreatmentPlan
