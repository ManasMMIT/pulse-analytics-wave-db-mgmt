import React from 'react'

import { UnderlinedTabs } from '../../../components/Tabs'

import UsersTab from './UsersTab'

const TAB_ONE = 'Users'

const FILTER_TAB_OPTIONS = [
  TAB_ONE,
]

const UsersPanel = () => {
  return (
    <div>
      <UnderlinedTabs tabsData={FILTER_TAB_OPTIONS}>
        {
          [
            <UsersTab key="Users" />,
          ]
        }
      </UnderlinedTabs>
    </div>
  )
}
export default UsersPanel
