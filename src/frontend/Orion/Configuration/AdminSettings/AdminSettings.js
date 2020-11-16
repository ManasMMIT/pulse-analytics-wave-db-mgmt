import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import BusinessObjectManagement from './BusinessObjectManagement'
import BomManagement from './BomManagement'
import AquilaManagement from './AquilaManagement'
import SheetManagement from './SheetManagement'
import NodeManagement from './NodeManagement'
import DevToProdPushManagement from './DevToProdPushManagement'
import AddSourceNode from './AddSourceNode'
import EditRoleNodeView from './EditRoleNodeView'
import EndUserTerms from './EndUserTerms'
import TotalHistory from './TotalHistory'

const AdminSettings = () => (
  <Switch>
    <Route
      path={'/orion/configuration/admin-settings/bo-management'}
      component={BusinessObjectManagement}
    />
    <Route
      path={'/orion/configuration/admin-settings/bom-management'}
      component={BomManagement}
    />
    <Route
      path={'/orion/configuration/admin-settings/sheet-management'}
      component={SheetManagement}
    />
    <Route
      path={'/orion/configuration/admin-settings/node-management'}
      component={NodeManagement}
    />
    <Route
      path={'/orion/configuration/admin-settings/aquila-management'}
      component={AquilaManagement}
    />
    <Route
      path={'/orion/configuration/admin-settings/add-source-node'}
      component={AddSourceNode}
    />
    <Route
      path={'/orion/configuration/admin-settings/edit-role-node'}
      component={EditRoleNodeView}
    />
    <Route
      path={'/orion/configuration/admin-settings/end-user-terms'}
      component={EndUserTerms}
    />
    <Route
      path={'/orion/configuration/admin-settings/dev-to-prod-push-management'}
      component={DevToProdPushManagement}
    />
    <Route
      path={'/orion/configuration/admin-settings/total-history'}
      component={TotalHistory}
    />
    <Redirect to={'/orion/configuration/admin-settings/bo-management'} />
  </Switch>
)

export default AdminSettings
