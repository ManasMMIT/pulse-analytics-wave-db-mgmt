import React from 'react'
import { useQuery } from '@apollo/client'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'

import { pathwaysEmailSubscription } from '../../../utils/email-subscription-options'
import { GET_USERS } from '../../../api/queries'

import { Colors } from '../../../utils/pulseStyles'

const subscriptionId = pathwaysEmailSubscription._id

const COLUMNS = [
  {
    Header: 'Client',
    accessor: 'client.description',
    sortType: 'text',
  },
  {
    Header: 'Username',
    accessor: 'username',
    sortType: 'text',
  },
  {
    Header: 'Email',
    accessor: 'email',
    sortType: 'text',
  },
]

const UsersTable = () => {
  const now = new Date()
  const filename = `user-email-list-${now.toISOString()}`

  const { data, loading, error } = useQuery(GET_USERS, {
    variables: { subscriptionId },
    fetchPolicy: 'network-only', // prevent caching to always get latest
  })

  if (loading)
    return (
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
          <p style={{ color: Colors.PRIMARY, fontSize: 12, fontWeight: 600 }}>
            Loading Client Emails Table
          </p>
          <Spinner size="32" />
        </div>
      </div>
    )
  if (error)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: Colors.RED,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: '22px',
          }}
        >
          There was an error loading the Client Emails Table.
          <br />
          Please reload the page before sending client emails for verification.
          ⟲
        </p>
      </div>
    )

  const { users } = data

  return (
    <Table
      width={'calc(100vw - 500px)'}
      data={users}
      columns={COLUMNS}
      exportStyle={{ margin: 24 }}
      exportProps={{ filename }}
    />
  )
}

export default UsersTable
