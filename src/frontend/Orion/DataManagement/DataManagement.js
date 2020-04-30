import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'

import NewQueryTool from './NewQueryTool'
import QueryTool from './QueryTool'
import Questions from './Questions'
import Import from './Import'
import NewImport from './NewImport'
import SheetManagement from './SheetManagement'
import BusinessObjectManagement from './BusinessObjectManagement'
import ExportCustomData from './ExportCustomData'
import PayerProjectsList from './PayerProjects/PayerProjectsList'
import PayerProject from './PayerProjects/PayerProject'
import AddSourceNode from './AddSourceNode'
import EditRoleNodeView from './EditRoleNodeView'

const DataManagement = () => (
  <Switch>
    <Route path="/orion/data-management/query" component={QueryTool} />
    <Route path="/orion/data-management/new-query" component={NewQueryTool} />
    <Route path="/orion/data-management/questions" component={Questions} />
    <Route path="/orion/data-management/import" component={Import} />
    <Route path="/orion/data-management/sheet-management" component={SheetManagement} />
    <Route path="/orion/data-management/bo-management" component={BusinessObjectManagement} />
    <Route path="/orion/data-management/new-import" component={NewImport} />
    <Route path="/orion/data-management/export-custom-data" component={ExportCustomData} />
    <Route exact path="/orion/data-management/payer-projects" component={PayerProjectsList} />
    <Route path="/orion/data-management/payer-projects/:projectId" component={PayerProject} />
    <Route path="/orion/data-management/add-source-node" component={AddSourceNode} />
    <Route
      path="/orion/data-management/edit-role-node"
      component={EditRoleNodeView}
    />
    <Redirect to={'/orion/data-management/import'} />
  </Switch>
)

export default DataManagement
