import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Pathways from './Pathways'
import Payer from './Payer'
import Provider from './Provider'
import Apm from './Apm'
import Obm from './Obm'
import Lbm from './Lbm'

const Organizations = () => (
  <Switch>
    <Route path={'/orion/organizations/apm'} component={Apm} />
    <Route path={'/orion/organizations/mbm/obm'} component={Obm} />
    <Route path={'/orion/organizations/mbm/lbm'} component={Lbm} />
    <Route path={'/orion/organizations/pathways'} component={Pathways} />
    <Route path={'/orion/organizations/payer'} component={Payer} />
    <Route path={'/orion/organizations/provider'} component={Provider} />
    <Redirect to={'/orion/organizations/apm'} />
  </Switch>
)

export default Organizations
