import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Accounts from './Accounts'

const Apm = () => (
  <Switch>
    <Route path={'/orion/organizations/apm/accounts'} component={Accounts} />
    <Redirect to={'/orion/organizations/apm/accounts'} />
  </Switch>
)

export default Apm
