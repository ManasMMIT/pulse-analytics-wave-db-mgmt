import React from 'react'

import VerticalTabs from '../components/Tabs/VerticalTabs'
import IndicationsPanel from './IndicationsPanel'
import ProductsPanel from './ProductsPanel'
import RegimensPanel from './RegimensPanel'

const TAB_ONE = 'Indications'
const TAB_TWO = 'Products'
const TAB_THREE = 'Regimens'

const FILTER_TAB_OPTIONS = [
  TAB_ONE,
  TAB_TWO,
  TAB_THREE,
]

const tabsContainerStyle = {
  width: 250,
  backgroundColor: 'rgb(10, 53, 87)',
}

const tabContainerStyle = {
  padding: 24,
}

const inactiveTabStyle = {
  color: 'rgb(122, 151, 177)',
}

const activeTabStyle = {
  color: 'rgb(235, 246, 251)',
  borderLeft: '4px solid rgb(15, 102, 208)',
}

const Orion = () => {
  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <VerticalTabs
        tabsData={FILTER_TAB_OPTIONS}
        tabsContainerStyle={tabsContainerStyle}
        tabContainerStyle={tabContainerStyle}
        inactiveTabStyle={inactiveTabStyle}
        activeTabStyle={activeTabStyle}
      >
        <IndicationsPanel />
        <ProductsPanel />
        <RegimensPanel />
      </VerticalTabs>
    </div>
  )
}

export default Orion
