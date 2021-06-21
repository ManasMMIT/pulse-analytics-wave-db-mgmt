import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Roles from './Roles'
import IndicationRoleSpecialties from './IndicationRoleSpecialties'

const StakeholderRoles = () => (
  <Switch>
    <Route
      path={'/orion/specialized/value-perception/stakeholder-roles/roles'}
      component={Roles}
    />
    <Route
      path={
        '/orion/specialized/value-perception/stakeholder-roles/indication-role-specialties'
      }
      component={IndicationRoleSpecialties}
    />
    <Redirect
      to={'/orion/specialized/value-perception/stakeholder-roles/roles'}
    />
  </Switch>
)

export default StakeholderRoles
