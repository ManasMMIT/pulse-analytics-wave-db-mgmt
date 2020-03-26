import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import _ from 'lodash'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import {
  BACKUP_EXPORT,
  UPSERT_ORGANIZATION_META,
} from '../../api/mutations'

import {
  GET_ORGANIZATION_META,
} from '../../api/queries'

import Spinner from '../../Phoenix/shared/Spinner'
import ExportExcelButton from './ExportExcelButton'
import {
  formatDateTime,
  formatDateTimeDotted,
} from '../../utils/formatDate'

// taken from https://redstapler.co/sheetjs-tutorial-create-xlsx/
const s2ab = s => {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

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

const ExportExcelButtonContainer = ({
  data,
  filename,
  isDisabled,
  createBackup,
  children,
  sheetName,
}) => {
  const user = JSON.parse(localStorage.getItem('user'))

  const formattedDate = formatDateTimeDotted(new Date())

  const finalFileName = `${filename}_${formattedDate}_${user.name}`

  const [finalFilename, setFinalFilename] = useState(finalFileName)

  useEffect(() => {
    setFinalFilename(finalFileName)
  }, [filename])

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
    {
      variables: { _ids: dataIds },
    }
  )

  let dataWithMetaFields = data
  if (!isMetaDataLoading && createBackup) {
    const { organizationMeta } = metaData
    dataWithMetaFields = getOrgsWithMetaData(data, organizationMeta)
  }

  /* convert from json to workbook */
  const worksheet = XLSX.utils.json_to_sheet(dataWithMetaFields)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Sheet1')

  const wbOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })

  const [writeMetaData] = useMutation(UPSERT_ORGANIZATION_META, {
    variables: {
      input: {
        action: 'export',
        _ids: dataIds,
      }
    },
  })

  const saveFile = () => {
    const blob = new Blob(
      [s2ab(wbOut)],
      {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    )

    saveAs(blob, finalFilename + '.xlsx')
  }

  const [backupExport, { loading: isBackingUp, error }] = useMutation(BACKUP_EXPORT, {
    onCompleted: async () => {
      saveFile()

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

  const backupExportWithTimestamp = () => {
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

  const onClick = createBackup ? backupExportWithTimestamp : saveFile

  return (
    <div>
      <ExportExcelButton
        isDisabled={isDisabled}
        onClick={onClick}
      >
        {
          isBackingUp
            ? <Spinner />
            : children
        }
      </ExportExcelButton>
      {
        error && <div style={{ color: 'red', fontSize: 10, padding: 4 }}>Export Failed</div>
      }
    </div>
  )
}

ExportExcelButtonContainer.propTypes = {
  data: PropTypes.array, // JSON
  createBackup: PropTypes.bool,
  ...ExportExcelButton.propTypes,
}

ExportExcelButtonContainer.defaultProps = {
  data: [],
  createBackup: false,
  ...ExportExcelButton.defaultProps,
}

const ExportExcelButtonSuperContainer = props => {
  if (!props.data.length) return (
    <ExportExcelButton isDisabled={true}>
      {props.children}
    </ExportExcelButton>
  )

  return <ExportExcelButtonContainer {...props} />
}

export default ExportExcelButtonSuperContainer
