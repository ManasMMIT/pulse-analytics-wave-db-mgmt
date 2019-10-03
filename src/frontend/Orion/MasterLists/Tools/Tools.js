import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Pathways from './Pathways'
import Payer from './Payer'
import Provider from './Provider'
import Apm from './Apm'

const Tools = props => (
  <Switch>
    <Route path={'/orion/lists/tools/pathways'} component={Pathways} />
    <Route path={'/orion/lists/tools/payer'} component={Payer} />
    <Route path={'/orion/lists/tools/provider'} component={Provider} />
    <Route path={'/orion/lists/tools/apm'} component={Apm} />
    <Redirect to={'/orion/lists/tools/pathways'} />
  </Switch>
)

export default Tools
