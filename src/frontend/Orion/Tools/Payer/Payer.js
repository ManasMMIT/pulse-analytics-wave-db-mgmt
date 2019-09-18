import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import QualityAccessScorePanel from './QualityAccessScorePanel'

const Payer = () => (
  <Switch>
    <Route path={'/orion/tools/payer/scores'} component={QualityAccessScorePanel} />
    <Redirect to={'/orion/tools/payer/scores'} />
  </Switch>
)

export default Payer
