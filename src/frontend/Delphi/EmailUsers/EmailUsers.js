import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import Spinner from '../../Phoenix/shared/Spinner'
import Card from '../../components/Card'
import UnderlinedTabs from '../../components/Tabs/UnderlinedTabs'

import UserTable from './UserTable'
import UserActions from './UserActions'
import {
  VIEW_ALL_USERS,
  ADD_CLIENT_TAB,
  ADD_TEST_TAB,
  REMOVE_TAB,
} from './utils'

import { GET_EMAIL_USERS } from '../../api/queries'

const TABS = [VIEW_ALL_USERS, ADD_CLIENT_TAB, ADD_TEST_TAB, REMOVE_TAB]

const EmailUsers = () => {
  const { data, loading, error } = useQuery(GET_EMAIL_USERS)

  const [tab, setTab] = useState(VIEW_ALL_USERS)
  const [users, setUsers] = useState([])

  if (loading) return <Spinner />
  if (error) {
    return <div style={{ color: 'red' }}>Error processing request</div>
  }

  const handleTabToggle = value => {
    setTab(value)
    setUsers([])
  }

  const isTabViewUsers = tab === VIEW_ALL_USERS

  return (
    <Card title={'Email User Management'}>
      <UnderlinedTabs tabsData={TABS} useStateProps={[tab, handleTabToggle]} />
      {isTabViewUsers ? (
        <UserTable
          data={data.emailUsers}
          style={{ marginTop: 12, width: '100%', height: 254 }}
          isTabViewUsers={isTabViewUsers}
        />
      ) : (
        <UserActions users={users} setUsers={setUsers} selectedTab={tab} />
      )}
    </Card>
  )
}

export default EmailUsers
