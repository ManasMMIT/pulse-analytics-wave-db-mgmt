import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { parseAsync } from 'json2csv'
import { transparentize } from 'polished'

import { Colors } from './../utils/pulseStyles'

const primaryColor = Colors.PRIMARY

const CsvButton = styled.a({
  textDecoration: 'none',
  background: primaryColor,
  color: 'white',
  fontSize: 12,
  padding: '8px 12px',
  borderRadius: 4,
  fontWeight: 700,
  margin: '12px 12px 6px 12px',
  display: 'block',
  width: 65,
  ':hover': {
    background: transparentize(0.3, primaryColor),
  }
})

const DownloadCsvButton = ({
  data,
  fileName,
}) => {
  const [csv, setCsv] = useState('')

  if (!data || !data.length) return null

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
}

DownloadCsvButton.defaultProps = {
  data: [],
  fileName: '',
}

export default DownloadCsvButton
