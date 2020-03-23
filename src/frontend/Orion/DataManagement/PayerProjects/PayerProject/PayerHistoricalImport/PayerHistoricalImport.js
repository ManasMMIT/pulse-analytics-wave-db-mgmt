import React from 'react'
import styled from '@emotion/styled'

import ImportSection from './ImportSection'

const PayerHistoricalImportWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flexWrap: 'wrap',
})

const SectionWrapper = styled.div({
  display: 'flex',
  height: '50%'
})

const PayerHistoricalImport = () => {
  return (
    <PayerHistoricalImportWrapper>
      <SectionWrapper>
        <ImportSection />
        <div>
          TODO: Timestamp list
        </div>
      </SectionWrapper>
      <SectionWrapper>
        TODO: Error/Warning Table placeholder
      </SectionWrapper>
    </PayerHistoricalImportWrapper>
  )
}

export default PayerHistoricalImport