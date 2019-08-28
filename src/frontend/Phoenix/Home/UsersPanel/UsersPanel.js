import React from 'react'

import { UnderlinedTabs } from '../../../components/Tabs'

import UsersTab from './UsersTab'
import ViewControlTab from './ViewControlTab'

const TAB_ONE = 'Users'
const TAB_TWO = 'View Control'

const FILTER_TAB_OPTIONS = [
  TAB_ONE,
  TAB_TWO,
]

const UsersPanel = () => {
  return (
    <div>
      <UnderlinedTabs tabsData={FILTER_TAB_OPTIONS}>
        {
          [
            <UsersTab key="Users" />,
            <ViewControlTab key="View Control" />,
          ]
        }
      </UnderlinedTabs>
    </div>
  )
}
export default UsersPanel
