import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors } from '../../utils/pulseStyles'

const primaryColor = Colors.PRIMARY

const ExportButton = styled.button({
  background: transparentize(0.85,primaryColor),
  color: primaryColor,
  fontSize: 12,
  fontWeight: 700,
  padding: '8px 12px',
  borderRadius: 4,
  cursor: 'pointer',
  marginLeft: 24,
  ':hover': {
    background: transparentize(0.65, primaryColor),
  }
}, ({ disabled }) => {
  return disabled
    ? {
      background: transparentize(0.85, Colors.MEDIUM_GRAY_2),
      color: 'grey',
      cursor: 'not-allowed',
    }
    : {}
})

const ExportExcelButton = ({
  isDisabled,
  onClick,
  children,
}) => {
  return (
    <ExportButton
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </ExportButton>
  )
}

ExportExcelButton.propTypes = {
  isDisabled: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func,
}

ExportExcelButton.defaultProps = {
  isDisabled: false,
  children: 'Export to Excel',
  onClick: () => {},
}

export default ExportExcelButton
