import { jsx } from '@emotion/core'
import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from 'frontend/utils/color'
import Transitions from 'frontend/utils/transitions'

const primaryColor = Color.PRIMARY

const ExportButton = styled.button(
  {
    background: transparentize(0.85, primaryColor),
    color: primaryColor,
    fontSize: 12,
    fontWeight: 700,
    padding: '8px 12px',
    borderRadius: 4,
    cursor: 'pointer',
    margin: '12px 0px',
    transition: Transitions.NORMAL,
    ':hover': {
      background: transparentize(0.65, primaryColor),
    },
    ':active': {
      background: transparentize(0.75, primaryColor),
    },
  },
  ({ disabled }) => {
    return disabled
      ? {
          background: transparentize(0.85, Color.MEDIUM_GRAY_2),
          color: 'grey',
          cursor: 'not-allowed',
        }
      : {}
  }
)

const ExportExcelButton = ({ isDisabled, onClick, children, buttonStyle }) => {
  return (
    <ExportButton css={buttonStyle} disabled={isDisabled} onClick={onClick}>
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
