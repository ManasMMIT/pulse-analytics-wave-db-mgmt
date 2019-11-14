import React, { useRef } from 'react'
import { ReactTabulator } from 'react-tabulator'
import { useQuery } from '@apollo/react-hooks'

import { pathwaysEmailSubscription } from '../../../utils/email-subscription-options'
import { GET_USERS } from '../../../api/queries'

import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/tabulator.min.css'

const subscriptionId = pathwaysEmailSubscription._id

const TABLE_COLUMNS = [
  { title: "client", field: "client.description" },
  { title: "username", field: "username" },
  { title: "email", field: "email" },
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

  if (loading) return 'Loading...'
  if (error) return 'Error!'

  const { users } = data

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button
          onClick={() => tableRef.current.table.download("csv", "usersToEmail.csv")}
        >
          Download CSV
        </button>
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
