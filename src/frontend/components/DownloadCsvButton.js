import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { parse } from 'json2csv'
import { transparentize } from 'polished'

import { Colors } from './../utils/pulseStyles'

const primaryColor = Colors.PRIMARY

const CsvButton = styled.a({
  textDecoration: 'none',
  background: transparentize(0.85,primaryColor),
  color: primaryColor,
  fontSize: 12,
  fontWeight: 700,
  padding: '8px 12px',
  borderRadius: 4,
  display: 'block',
  ':hover': {
    background: transparentize(0.65, primaryColor),
  }
}, ({ isDisabled }) => {
  return isDisabled
    ? {
      background: transparentize(0.85, Colors.MEDIUM_GRAY_2),
      pointerEvents: 'none', // ! not supported on IE<11
      color: 'grey',
    }
    : {}
})

const DownloadCsvButton = ({
  data,
  fileName,
  isDisabled,
}) => {
  let csv = ''

  if (data.length) {
    csv = parse(data, { includeEmptyRows: true })
  }

  const csvContent = "data:text/csv;charset=utf-8," + csv

  const encodedUri = encodeURI(csvContent)

  return (
    <CsvButton
      isDisabled={isDisabled}
      href={encodedUri}
      download={`${ fileName }.csv`}
    >
      Export CSV
    </CsvButton>
  )
}

DownloadCsvButton.propTypes = {
  data: PropTypes.array, // JSON
  fileName: PropTypes.string,
  isDisabled: PropTypes.bool,
}

DownloadCsvButton.defaultProps = {
  data: [],
  fileName: '',
  isDisabled: false,
}

export default DownloadCsvButton
