import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { parse } from 'json2csv'

import {
  BACKUP_EXPORT,
} from './../../api/mutations'

import Spinner from '../../Phoenix/shared/Spinner'
import DownloadCsvButton from './DownloadCsvButton'

const DownloadCsvButtonContainer = ({
  data,
  filename,
  isDisabled,
  createBackup,
  children,
}) => {
  const [finalFilename, setFinalFilename] = useState(filename)

  const csv = data.length
    ? parse(data, { includeEmptyRows: true })
    : ''

  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv)

  const [backupExport, { loading: isBackingUp, error }] = useMutation(BACKUP_EXPORT, {
    onCompleted: () => {
      const link = document.createElement("a")
      link.href = encodedUri
      link.download = `${finalFilename}.csv`

      link.click()
      link.remove() // ! never actually appended to DOM, so probably doesn't do anything
    }
  })

  const { sub: userId } = JSON.parse(localStorage.getItem('user'))

  const backupExportWithTimestamp = () => {
    const finalFileName = `${filename}-${new Date().toISOString()}-${userId}`

    setFinalFilename(finalFileName)

    backupExport({
      variables: {
        input: {
          filename: finalFileName,
          data,
        }
      },
    })
  }

  const onClick = createBackup ? backupExportWithTimestamp : undefined

  return (
    <div>
      <DownloadCsvButton
        isDisabled={isDisabled}
        onClick={onClick}
      >
        {
          isBackingUp
            ? <Spinner />
            : children
        }
      </DownloadCsvButton>
      {
        error && <div style={{ color: 'red', fontSize: 10, padding: 4 }}>Export Failed</div>
      }
    </div>
  )
}

DownloadCsvButtonContainer.propTypes = {
  data: PropTypes.array, // JSON
  createBackup: PropTypes.bool,
  ...DownloadCsvButton.propTypes,
}

DownloadCsvButtonContainer.defaultProps = {
  data: [],
  createBackup: false,
  ...DownloadCsvButton.defaultProps,
}

export default DownloadCsvButtonContainer
