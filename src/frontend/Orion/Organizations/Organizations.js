import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Pathways from './Pathways'
import Payer from './Payer'
import Provider from './Provider'
import Apm from './Apm'
import Obm from './Obm'

const Organizations = props => (
  <Switch>
    <Route
      path={'/orion/organizations/pathways'}
      component={Pathways}
    />
    <Route
      path={'/orion/organizations/payer'}
      component={Payer}
    />
    <Route
      path={'/orion/organizations/provider'}
      component={Provider}
    />
    <Route
      path={'/orion/organizations/apm'}
      component={Apm}
    />
    <Route
      path={'/orion/organizations/obm'}
      component={Obm}
    />
    <Redirect to={'/orion/organizations/pathways'} />
  </Switch>
)

export default Organizations
