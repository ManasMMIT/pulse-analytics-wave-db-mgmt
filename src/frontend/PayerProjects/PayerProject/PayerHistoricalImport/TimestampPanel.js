import PropTypes from "prop-types";
import React from 'react'
import styled from '@emotion/styled'
import Color from 'frontend/utils/color'
import Icon from 'frontend/components/Icon'
import Spacing from 'frontend/utils/spacing';
import fontSpace from 'frontend/utils/fontspace'
import { AlphaColors } from 'frontend/utils/pulseStyles'

const PanelWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: Spacing.S4,
  padding: '6px 10px',
  ...fontSpace.FS2,
  borderRadius: 4,
  fontWeight: 500,
}, ({ isLastImport  }) => ({
  backgroundColor: isLastImport ? Color.PRIMARY : AlphaColors.Blue10,
  color: isLastImport ? Color.WHITE : Color.PRIMARY
}))

const IconWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const LatestLabel = styled.div({
  color: Color.PRIMARY,
  backgroundColor: Color.WHITE,
  padding: `0px ${ Spacing.S2 }`,
  borderRadius: 4,
  ...fontSpace.FS1
})

const Wrapper = styled.div({
  margin: Spacing.S4,
})

const TimestampPanel = ({
  timestamps,
}) => {
  return (
    <Wrapper>
      {timestamps.map((timestamp, idx) => {
        const isLastImport = idx === 0
        const color1 = isLastImport ? Color.WHITE : Color.PRIMARY

        return (
          <PanelWrapper isLastImport={isLastImport} key={timestamp}>
            <IconWrapper>
              <Icon
                iconName="stopwatch"
                width={14}
                color1={color1}
                style={{ marginRight: Spacing.S3 }}
              />
              { timestamp }
            </IconWrapper>
            { isLastImport && <LatestLabel>Last Import</LatestLabel>}
          </PanelWrapper>
        )
        })}
    </Wrapper>
  )
}

TimestampPanel.propTypes = {
  timestamps: PropTypes.array.isRequired
}

export default TimestampPanel