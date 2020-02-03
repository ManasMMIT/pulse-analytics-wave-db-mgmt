import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { parse } from 'json2csv'
import _ from 'lodash'

import {
  BACKUP_EXPORT,
  UPSERT_ORGANIZATION_META,
} from './../../api/mutations'

import {
  GET_ORGANIZATION_META,
} from './../../api/queries'

import Spinner from '../../Phoenix/shared/Spinner'
import DownloadCsvButton from './DownloadCsvButton'

const DownloadCsvButtonContainer = ({
  data,
  filename,
  isDisabled,
  createBackup,
  children,
}) => {
  const [dataToExport, setDataToExport] = useState(data)

  const dataIds = dataToExport.reduce((acc, { _id }) => {
    // ? data comes in with empty rows
    if (_id) acc.push(_id)

    return acc
  }, [])

  useQuery(
    GET_ORGANIZATION_META,
    {
      variables: { _ids: dataIds },
      onCompleted: ({ organizationMeta }) => {
        const metaDataGroupedByOrgId = _.groupBy(organizationMeta, 'accountId')

        const clonedData = _.cloneDeep(dataToExport)

        const dataWithMetaFields = clonedData.map(clonedDatum => {
          const metaFields = metaDataGroupedByOrgId[clonedDatum._id]
            ? metaDataGroupedByOrgId[clonedDatum._id][0]
            : {}

          const metaFieldObj = metaFields
            ? {
              exportedAt: metaFields.exportedAt,
              exporter: metaFields.exporter ? metaFields.exporter.name : null,
              updatedAt: metaFields.updatedAt,
              updater: metaFields.updater ? metaFields.updater.name : null,
            }
            : {}

          return {
            ...clonedDatum,
            ...metaFieldObj,
          }
        })

        setDataToExport(dataWithMetaFields)
      }
    }
  )

  const [finalFilename, setFinalFilename] = useState(filename)

  const csv = dataToExport.length
    ? parse(dataToExport, { includeEmptyRows: true })
    : ''

  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv)

  const [writeMetaData] = useMutation(UPSERT_ORGANIZATION_META, {
    variables: {
      input: {
        action: 'export',
        _ids: dataIds,
      }
    }
  })

  const [backupExport, { loading: isBackingUp, error }] = useMutation(BACKUP_EXPORT, {
    onCompleted: async () => {
      const link = document.createElement("a")
      link.href = encodedUri
      link.download = `${finalFilename}.csv`

      await writeMetaData()

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
          data: dataToExport,
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

const DownloadCsvButtonSuperContainer = props => {
  if (!props.data.length) return null

  return <DownloadCsvButtonContainer {...props} />
}

export default DownloadCsvButtonSuperContainer
