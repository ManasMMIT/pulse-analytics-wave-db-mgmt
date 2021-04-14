import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import BusinessObjectManagement from './BusinessObjectManagement'
import BusinessObjectModalManagement from './BomManagement'

const BusinessObject = () => (
  <Switch>
    <Route
      path={'/orion/administrator/business-object/business-object-mgmt'}
      component={BusinessObjectManagement}
    />
    <Route
      path={'/orion/administrator/business-object/business-object-modal-mgmt'}
      component={BusinessObjectModalManagement}
    />
    <Redirect
      to={'/orion/administrator/business-object/business-object-mgmt'}
    />
  </Switch>
)

export default BusinessObject
