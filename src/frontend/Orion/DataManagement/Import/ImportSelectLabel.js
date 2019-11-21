import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import { Colors, Spacing } from '../../../utils/pulseStyles'

const Label = styled.div({
  color: Colors.BLACK,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '22px',
  marginBottom: Spacing.SMALL,
})

const ImportSelectLabel = ({label}) => (
  <>
    <Label>
      {label}
    </Label>
  </>
)

ImportSelectLabel.propTypes = {
  label: PropTypes.string
}

ImportSelectLabel.defaultProps = {
  label: "Select Label"
}

export default ImportSelectLabel
