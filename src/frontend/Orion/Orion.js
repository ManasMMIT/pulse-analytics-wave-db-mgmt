import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { withApollo } from 'react-apollo'

import Sidebar from './Sidebar'

import MasterLists from './MasterLists'
// import IndicationsPanel from './Master Lists/IndicationsPanel'
// import ProductsPanel from './ProductsPanel'
// import RegimensPanel from './Master Lists/RegimensPanel'
import TreatmentPlans from './MasterLists/TreatmentPlans'
import QualityAccessScorePanel from './QualityAccessScorePanel'

import { SELECT_INDICATION } from './../api/mutations'

class Orion extends React.Component {
  state = {
    isLoading: true,
  }

  // TODO: Not sure if needed anymore 
  componentDidMount() {
    const { client } = this.props

    client.mutate({ mutation: SELECT_INDICATION })
      .then(() => this.setState({ isLoading: false }))
  }

  render() {
    if (this.state.isLoading) return null

    return (
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Switch>
          <Route path={'/orion/lists'} component={MasterLists} />
          {/* <Route path={'/orion/treatment-plans'} component={TreatmentPlans} />
          <Route path={'/orion/indications'} component={IndicationsPanel} />
          <Route path={'/orion/regimens'} component={RegimensPanel} />
          <Route path={'/orion/products'} component={ProductsPanel} /> */}
          <Route path={'/orion/payer/scores'} component={QualityAccessScorePanel} />
          <Redirect to={'/orion/lists/treatment-plans'} component={TreatmentPlans} />
        </Switch>
      </div>
    )
  }
}

export default withApollo(Orion)
