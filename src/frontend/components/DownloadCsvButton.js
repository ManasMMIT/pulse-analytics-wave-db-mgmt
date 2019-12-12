import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { parseAsync } from 'json2csv'
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
})

const DownloadCsvButton = ({
  data,
  fileName,
  show,
}) => {
  const [csv, setCsv] = useState('')

  if (!show) return null

  parseAsync(data, { includeEmptyRows: true }).then(setCsv)

  const csvContent = "data:text/csv;charset=utf-8," + csv

  const encodedUri = encodeURI(csvContent)

  return (
    <CsvButton
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
  show: PropTypes.bool,
}

DownloadCsvButton.defaultProps = {
  data: [],
  fileName: '',
  show: true,
}

export default DownloadCsvButton
