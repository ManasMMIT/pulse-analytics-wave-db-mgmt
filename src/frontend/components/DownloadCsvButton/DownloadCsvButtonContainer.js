import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { parse } from 'json2csv'
import _ from 'lodash'

import Spinner from '../../Phoenix/shared/Spinner'
import DownloadCsvButton from './DownloadCsvButton'

import { formatDateTime } from '../../utils/formatDate'

import {
  BACKUP_EXPORT,
  UPSERT_ORGANIZATION_META,
} from './../../api/mutations'

import {
  GET_ORGANIZATION_META,
} from './../../api/queries'

// ! needs to be pulled out to make this component more reusable
const getOrgsWithMetaData = (data, metaData) => {
  const metaDataGroupedByOrgId = _.groupBy(metaData, 'accountId')

  const clonedData = _.cloneDeep(data)

  const dataWithMetaFields = clonedData.map(clonedDatum => {
    const metaFields = metaDataGroupedByOrgId[clonedDatum._id]
      ? metaDataGroupedByOrgId[clonedDatum._id][0]
      : {}

    const { exportedAt, exporter, updatedAt, updater } = metaFields

    const metaFieldObj = metaFields
      ? {
        exportedAt: exportedAt ? formatDateTime(exportedAt) : null,
        exporter: exporter ? exporter.name : null,
        updatedAt: updatedAt ? formatDateTime(updatedAt) : null,
        updater: updater ? updater.name : null,
      }
      : {}

    return {
      ...clonedDatum,
      ...metaFieldObj,
    }
  })

  return dataWithMetaFields
}

const DownloadCsvButtonContainer = ({
  data,
  filename,
  isDisabled,
  createBackup,
  children,
}) => {
  const dataIds = data.reduce((acc, { _id }) => {
    // ? data comes in with empty rows
    if (_id) acc.push(_id)

    return acc
  }, [])

  const {
    data: metaData,
    loading: isMetaDataLoading,
  } = useQuery(
    GET_ORGANIZATION_META,
    { variables: { _ids: dataIds } }
  )

  let dataWithMetaFields = data
  if (!isMetaDataLoading) {
    const { organizationMeta } = metaData
    dataWithMetaFields = getOrgsWithMetaData(data, organizationMeta)
  }

  const [finalFilename, setFinalFilename] = useState(filename)

  const csv = dataWithMetaFields.length
    ? parse(dataWithMetaFields, { includeEmptyRows: true })
    : ''

  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv)

  const [writeMetaData] = useMutation(UPSERT_ORGANIZATION_META, {
    variables: {
      input: {
        action: 'export',
        _ids: dataIds,
      }
    },
  })

  const [backupExport, { loading: isBackingUp, error }] = useMutation(BACKUP_EXPORT, {
    onCompleted: () => {
      const link = document.createElement("a")
      link.href = encodedUri
      link.download = `${finalFilename}.csv`
      link.click()
      link.remove() // ! never actually appended to DOM, so probably doesn't do anything

      writeMetaData({
        refetchQueries: [
          { query: GET_ORGANIZATION_META, variables: { _ids: dataIds } },
          // ! Note: the below isn't needed but we don't understand why
          // ...dataIds.map(dataId => ({
          //   query: GET_ORGANIZATION_META, variables: { _ids: [dataId] }
          // }))
        ]
      })
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
          data: dataWithMetaFields,
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
