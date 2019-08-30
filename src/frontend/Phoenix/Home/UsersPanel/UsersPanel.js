import React from 'react'

import { UnderlinedTabs } from '../../../components/Tabs'

import UsersTabContent from './UsersTabContent'

const TAB_ONE = 'Users'

const FILTER_TAB_OPTIONS = [
  TAB_ONE,
]

const UsersPanel = () => {
  return (
    <div>
      <UnderlinedTabs tabsData={FILTER_TAB_OPTIONS}>
        <UsersTabContent key="Users" />
      </UnderlinedTabs>
    </div>
  )
}
export default UsersPanel
