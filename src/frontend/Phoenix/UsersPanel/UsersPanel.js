import React, { useState } from 'react'

import { UnderlinedTabs } from './../../components/Tabs'

import UsersTab from './UsersTab'
import ViewControlTab from './ViewControlTab'


const TAB_ONE = 'Users'
const TAB_TWO = 'View Control'

const FILTER_TAB_OPTIONS = [
  TAB_ONE,
  TAB_TWO,
]

const COMPONENT_MAP = {
  [TAB_ONE]: UsersTab,
  [TAB_TWO]: ViewControlTab,
}

const UsersPanel = () => {
  const [selectedTab, selectTab] = useState(TAB_ONE)

  const Component = COMPONENT_MAP[selectedTab]
  return (
    <div>
      <UnderlinedTabs
        tabsData={FILTER_TAB_OPTIONS}
        selectedTab={selectedTab}
        onTabClick={selectTab}
      />
      <Component />
    </div>
  )
}
export default UsersPanel
