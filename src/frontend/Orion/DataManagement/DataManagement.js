import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'

import PayerProjectsList from './PayerProjects/PayerProjectsList'
import PayerProject from './PayerProjects/PayerProject'

const DataManagement = () => (
  <Switch>
    <Route exact path="/orion/data-management/payer-projects" component={PayerProjectsList} />
    <Route path="/orion/data-management/payer-projects/:projectId" component={PayerProject} />
    <Redirect to={'/orion/data-management/import'} />
  </Switch>
)

export default DataManagement
