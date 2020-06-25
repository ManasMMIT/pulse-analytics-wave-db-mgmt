import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import AccountOverview from './AccountOverview'
import Services from './Services'
import Influencers from './Influencers'

const Obm = () => (
  <Switch>
    <Route
      path={'/orion/organizations/obm/account-overview'}
      component={AccountOverview}
    />
    <Route path={'/orion/organizations/obm/services'} component={Services} />
    <Route
      path={'/orion/organizations/obm/influencers'}
      component={Influencers}
    />
    <Redirect to={'/orion/organizations/obm/account-overview'} />
  </Switch>
)

export default Obm
