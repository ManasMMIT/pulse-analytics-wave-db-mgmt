import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Accounts from './Accounts'

const Provider = () => (
  <Switch>
    <Route path={'/orion/tools/provider/accounts'} component={Accounts} />
    <Redirect to={'/orion/tools/provider/accounts'} />
  </Switch>
)

export default Provider
