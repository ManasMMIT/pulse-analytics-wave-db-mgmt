import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Accounts from './Accounts'

const Provider = () => (
  <Switch>
    <Route path={'/orion/lists/tools/provider/accounts'} component={Accounts} />
    <Redirect to={'/orion/lists/tools/provider/accounts'} />
  </Switch>
)

export default Provider
