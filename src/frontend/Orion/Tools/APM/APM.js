import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Accounts from './Accounts'

const APM = () => (
  <Switch>
    <Route path={'/orion/tools/apm/accounts'} component={Accounts} />
    <Redirect to={'/orion/tools/apm/accounts'} />
  </Switch>
)

export default APM
