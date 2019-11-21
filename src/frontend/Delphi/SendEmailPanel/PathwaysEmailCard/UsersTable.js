import React, { useRef } from 'react'
import styled from '@emotion/styled'
import { ReactTabulator } from 'react-tabulator'
import { useQuery } from '@apollo/react-hooks'
import { transparentize } from 'polished'

import Spinner from '../../../Phoenix/shared/Spinner'

import { pathwaysEmailSubscription } from '../../../utils/email-subscription-options'
import { GET_USERS } from '../../../api/queries'

import { Colors, Spacing } from '../../../utils/pulseStyles'

import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/tabulator.min.css'

import './usersTableStyles.css'

const subscriptionId = pathwaysEmailSubscription._id

const DownloadCsvButton = styled.button({
  background: transparentize(0.85, Colors.PRIMARY),
  border: 'none',
  borderRadius: 4,
  color: Colors.PRIMARY,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '22px',
  padding: `${Spacing.TINY} ${Spacing.SMALL}`,
  ':hover': {
    background: transparentize(0.75, Colors.PRIMARY),
  },
  ':focus': {
    outline: 'none',
  },
  ':active': {
    background: transparentize(0.65, Colors.PRIMARY),
  }
})

const TABLE_COLUMNS = [
  { title: "Client", field: "client.description" },
  { title: "Username", field: "username" },
  { title: "Email", field: "email" },
]

const TABLE_OPTIONS = {
  downloadDataFormatter: (data) => data,
  downloadReady: (fileContents, blob) => blob,
}

const UsersTable = () => {
  const tableRef = useRef(null)

  const { data, loading, error } = useQuery(
    GET_USERS,
    {
      variables: { subscriptionId },
      fetchPolicy: 'network-only', // prevent caching to always get latest
    },
  )

  if (loading) return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <div>
        <p style={{ color: Colors.PRIMARY, fontSize: 12, fontWeight: 600,}}>
          Loading Client Emails Table
        </p>
        <Spinner size="32" />
      </div>
    </div>
  )
  if (error) return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <p style={{ color: Colors.RED, fontSize: 12, fontWeight: 600, lineHeight: '22px' }}>
        There was an error loading the Client Emails Table.
        <br />
        Please reload the page before sending client emails for verification. ⟲
      </p>
    </div>
  )

  const { users } = data

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <DownloadCsvButton
          onClick={() => tableRef.current.table.download("csv", "usersToEmail.csv")}
        >
          Download Table as CSV
        </DownloadCsvButton>
      </div>

      <ReactTabulator
        ref={tableRef}
        data={users}
        columns={TABLE_COLUMNS}
        tooltips={true}
        layout="fitData"
        options={TABLE_OPTIONS}
        height="100%"
      />
    </>
  )
}

export default UsersTable
