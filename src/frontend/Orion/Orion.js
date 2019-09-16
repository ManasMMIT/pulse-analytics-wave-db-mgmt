import React from 'react'
import { withApollo } from 'react-apollo'

import VerticalTabs from '../components/Tabs/VerticalTabs'
import IndicationsPanel from './IndicationsPanel'
import ProductsPanel from './ProductsPanel'
import RegimensPanel from './RegimensPanel'
import TreatmentPlans from './TreatmentPlans'
import QualityAccessScorePanel from './QualityAccessScorePanel'

import { SELECT_INDICATION } from './../api/mutations'

const TAB_ONE = 'Indications'
const TAB_TWO = 'Products'
const TAB_THREE = 'Regimens'
const TAB_FOUR = 'Treatment Plans'
const TAB_FIVE = 'Quality Access Scores'

const FILTER_TAB_OPTIONS = [
  TAB_ONE,
  TAB_TWO,
  TAB_THREE,
  TAB_FOUR,
  TAB_FIVE,
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

class Orion extends React.Component {
  state = {
    isLoading: true,
  }

  componentDidMount() {
    const { client } = this.props

    client.mutate({ mutation: SELECT_INDICATION })
      .then(() => this.setState({ isLoading: false }))
  }

  render() {
    if (this.state.isLoading) return null

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
          <TreatmentPlans />
          <QualityAccessScorePanel />
        </VerticalTabs>
      </div>
    )
  }
}

export default withApollo(Orion)
