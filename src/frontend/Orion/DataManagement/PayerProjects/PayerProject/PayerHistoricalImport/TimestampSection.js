import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import Stepper from '@material-ui/core/Stepper'
import StepLabel from '@material-ui/core/StepLabel'
import Step from '@material-ui/core/Step'
import { withStyles } from '@material-ui/core/styles'

import Spacing from '../../../../../utils/spacing'
import FontSpace from '../../../../../utils/fontspace'
import Color from '../../../../../utils/color'
import { FontFamily } from '../../../../../utils/pulseStyles'
import { formatDateMonthYearLong } from '../../../../../utils/formatDate'

import { GET_SINGLE_PAYER_PROJECT } from '../../../../../api/queries'
import Spinner from 'frontend/components/Spinner'

const Title = styled.h1({
  padding: Spacing.S7,
  ...FontSpace.FS4,
})

const TimestampWrapper = styled.div({
  overflow: 'scroll',
})

const SectionWrapper = styled.div({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  borderBottom: `1px solid ${ Color.LIGHT_GRAY_1 }`
})

const StyledStepLabel = withStyles({
  label: {
    ...FontSpace.FS2,
    fontFamily: FontFamily.NORMAL,
    fontWeight: 500,
    color: Color.BLACK
  }
})(StepLabel)

const renderProjectTimestamps = (timestamps) => {
  const sortedTimestamps = timestamps.sort().reverse()
  return (
    <Stepper orientation="vertical" activeStep={-1}>
      {sortedTimestamps.map(timestamp => (
        <Step key={timestamp}>
          <StyledStepLabel>
            { formatDateMonthYearLong(timestamp) }
          </StyledStepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

const TimestampSection = ({
  projectId
}) => {
  const { data, loading } = useQuery(
    GET_SINGLE_PAYER_PROJECT,
    { variables: { projectId }}
  )

  const payerProjectTimestamps = loading
    ? <Spinner />
    : renderProjectTimestamps(data.singlePayerProject.timestamps)

  return (
    <SectionWrapper>
      <Title>Previous Imports by Timestamp</Title>
      {/* TODO: Add list and calendar view toggle */}
      <TimestampWrapper>
        { payerProjectTimestamps }
      </TimestampWrapper>
    </SectionWrapper>
  )
}

TimestampSection.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default TimestampSection
