import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import QualityAccessScorePanel from './QualityAccessScorePanel'
import Accounts from './Accounts'

const Payer = () => (
  <Switch>
    <Route path={'/orion/tools/payer/accounts'} component={Accounts} />
    <Route path={'/orion/tools/payer/scores'} component={QualityAccessScorePanel} />
    <Redirect to={'/orion/tools/payer/accounts'} />
  </Switch>
)

export default Payer
