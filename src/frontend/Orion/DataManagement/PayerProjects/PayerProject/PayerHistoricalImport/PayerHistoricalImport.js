import React from 'react'
import PropTypes from 'prop-types'
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

const PayerHistoricalImport = ({
  match,
}) => {
  const { projectId } = match.params
  return (
    <PayerHistoricalImportWrapper>
      <SectionWrapper>
        <ImportSection projectId={projectId} />
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

PayerHistoricalImport.propTypes = {
  match: PropTypes.object.isRequired,
}

export default PayerHistoricalImport