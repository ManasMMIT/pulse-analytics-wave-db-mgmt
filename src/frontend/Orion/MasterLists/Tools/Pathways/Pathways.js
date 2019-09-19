import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Accounts from './Accounts'

const Pathways = () => (
  <Switch>
    <Route path={'/orion/lists/tools/pathways/accounts'} component={Accounts} />
    <Redirect to={'/orion/lists/tools/pathways/accounts'} />
  </Switch>
)

export default Pathways
