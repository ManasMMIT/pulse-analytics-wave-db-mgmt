import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Accounts from './Accounts'
import Influencers from './Influencers'

const Pathways = () => (
  <Switch>
    <Route
      path={'/orion/organizations/pathways/accounts'}
      component={Accounts}
    />
    <Route
      path={'/orion/organizations/pathways/influencers'}
      component={Influencers}
    />
    <Redirect to={'/orion/organizations/pathways/accounts'} />
  </Switch>
)

export default Pathways
