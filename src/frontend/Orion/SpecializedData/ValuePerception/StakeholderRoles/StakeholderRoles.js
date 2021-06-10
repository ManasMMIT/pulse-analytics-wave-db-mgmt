import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Roles from './Roles'

const StakeholderRoles = () => (
  <Switch>
    <Route
      path={'/orion/specialized/value-perception/stakeholder-roles/roles'}
      component={Roles}
    />
    <Redirect
      to={'/orion/specialized/value-perception/stakeholder-roles/roles'}
    />
  </Switch>
)

export default StakeholderRoles
