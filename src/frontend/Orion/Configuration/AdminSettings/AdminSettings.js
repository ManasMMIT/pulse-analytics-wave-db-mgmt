import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import BusinessObjectManagement from './BusinessObjectManagement'
import SheetManagement from './SheetManagement'
// import PayerProjects from '../../DataManagement/PayerProjects'
import AddSourceNode from './AddSourceNode'
import EditRoleNodeView from './EditRoleNodeView'

const AdminSettings = () => (
  <Switch>
    <Route
      path={'/orion/configuration/admin-settings/bo-management'}
      component={BusinessObjectManagement}
    />
    <Route
      path={'/orion/configuration/admin-settings/sheet-management'}
      component={SheetManagement}
    />
    {/* <Route
      path={'/orion/configuration/admin-settings/payer-projects/:projectId?'}
      component={PayerProjects}
    /> */}
    <Route
      path={'/orion/configuration/admin-settings/add-source-node'}
      component={AddSourceNode}
    />
    <Route
      path={'/orion/configuration/admin-settings/edit-role-node'}
      component={EditRoleNodeView}
    />
    <Redirect to={'/orion/configuration/admin-settings/bo-management'} />
  </Switch>
)

export default AdminSettings
