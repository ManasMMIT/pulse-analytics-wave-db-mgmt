import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import AccountOverview from './AccountOverview'

const Obm = () => (
  <Switch>
    <Route path={'/orion/organizations/obm/account-overview'} component={AccountOverview} />
    <Redirect to={'/orion/organizations/obm/account-overview'} />
  </Switch>
)

export default Obm
