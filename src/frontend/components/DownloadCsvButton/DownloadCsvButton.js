import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors } from './../../utils/pulseStyles'

const primaryColor = Colors.PRIMARY

const CsvButton = styled.button({
  background: transparentize(0.85,primaryColor),
  color: primaryColor,
  fontSize: 12,
  fontWeight: 700,
  padding: '8px 12px',
  borderRadius: 4,
  cursor: 'pointer',
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

const DownloadCsvButton = ({
  uri,
  filename,
  isDisabled,
  onClick,
  children,
  shouldDownload,
}) => {
  if (!isDisabled && shouldDownload) {
    const link = document.createElement("a")
    link.href = uri
    link.download = `${ filename }.csv`

    link.click()
    link.remove() // ! never actually appended to DOM, so probably doesn't do anything
  }

  return (
    <CsvButton
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </CsvButton>
  )
}

DownloadCsvButton.propTypes = {
  uri: PropTypes.string, 
  filename: PropTypes.string,
  isDisabled: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func,
  shouldDownload: PropTypes.bool,
}

DownloadCsvButton.defaultProps = {
  uri: '#',
  filename: '',
  isDisabled: false,
  children: 'Export CSV',
  onClick: () => {},
  shouldDownload: true,
}

export default DownloadCsvButton
