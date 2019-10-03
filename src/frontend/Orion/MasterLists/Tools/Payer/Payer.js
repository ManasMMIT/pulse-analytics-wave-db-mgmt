import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import QualityAccessScorePanel from './QualityAccessScorePanel'
import Accounts from './Accounts'

const Payer = () => (
  <Switch>
    <Route path={'/orion/lists/tools/payer/accounts'} component={Accounts} />
    <Route path={'/orion/lists/tools/payer/scores'} component={QualityAccessScorePanel} />
    <Redirect to={'/orion/lists/tools/payer/accounts'} />
  </Switch>
)

export default Payer
