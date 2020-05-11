import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Accounts from './Accounts'

const Provider = () => (
  <Switch>
    <Route path={'/orion/organizations/provider/accounts'} component={Accounts} />
    <Redirect to={'/orion/organizations/provider/accounts'} />
  </Switch>
)

export default Provider
