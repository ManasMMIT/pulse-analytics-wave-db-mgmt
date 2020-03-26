import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import ImportSection from './ImportSection'
import TimestampSection from './TimestampSection'

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

const PayerHistoricalImport = ({
  match,
}) => {
  const { projectId } = match.params
  return (
    <PayerHistoricalImportWrapper>
      <SectionWrapper style={{ maxHeight: 500 }}>
        <ImportSection projectId={projectId} />
        <TimestampSection projectId={projectId} />
      </SectionWrapper>
      <SectionWrapper>
        TODO: Error/Warning Table placeholder
      </SectionWrapper>
    </PayerHistoricalImportWrapper>
  )
}

PayerHistoricalImport.propTypes = {
  match: PropTypes.object.isRequired,
}

export default PayerHistoricalImport