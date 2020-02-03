import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'

import {
  GET_ORGANIZATION_META,
} from './../../../../../api/queries'

import { AlphaColors } from './../../../../../utils/pulseStyles'

const dataStyle = {
  fontSize: 12,
  color: AlphaColors.Black80,
  padding: 6,
  letterSpacing: -0.2,
}

const AccountMetaData = ({
  accountId,
}) => {
  const { data } = useQuery(GET_ORGANIZATION_META, {
    variables: { _ids: [accountId] }
  })

  if (!data || !data.organizationMeta.length) return null

  const {
    updatedAt,
    exportedAt,
    updater,
    exporter,
  } = data.organizationMeta[0]

  const formattedUpdatedDate = updatedAt
    ? moment(updatedAt).format('L')
    : null

  const formattedExportedDate = exportedAt
    ? moment(exportedAt).format('L')
    : null

  return (
    <div>
      <div style={dataStyle}>
        Last Updated: {formattedUpdatedDate} by {updater.name}
      </div>
      <div style={dataStyle}>
        Last Exported: {formattedExportedDate} by {exporter.name}
      </div>
    </div>
  )
}

export default AccountMetaData
