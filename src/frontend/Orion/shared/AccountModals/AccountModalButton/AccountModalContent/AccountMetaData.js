import React from 'react'
import { useQuery } from '@apollo/client'

import {
  GET_ORGANIZATION_META,
} from './../../../../../api/queries'

import { AlphaColors } from './../../../../../utils/pulseStyles'
import { formatDateTime } from '../../../../../utils/formatDate'

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
    variables: { _ids: [accountId] },
  })

  if (!data || !data.organizationMeta.length) return null

  const {
    updatedAt,
    exportedAt,
    updater,
    exporter,
  } = data.organizationMeta[0]

  const formattedUpdatedDate = updatedAt ? formatDateTime(updatedAt) : null
  const formattedExportedDate = exportedAt ? formatDateTime(exportedAt) : null

  let updatedAtNode = null
  if (formattedUpdatedDate) {
    updatedAtNode = (
      <div style={dataStyle}>
        Last Updated: {formattedUpdatedDate} by {updater.name}
      </div>
    )
  }

  let exportedAtNode = null
  if (formattedExportedDate) {
    exportedAtNode = (
      <div style={dataStyle}>
        Last Exported: {formattedExportedDate} by {exporter.name}
      </div>
    )
  }

  return (
    <div>
      {updatedAtNode}
      {exportedAtNode}
    </div>
  )
}

export default AccountMetaData
