import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'

import QueryTool from './QueryTool'
import Questions from './Questions'
import Import from './Import'

const DataManagement = () => (
  <Switch>
    <Route path="/orion/data-management/query" component={QueryTool} />
    <Route path="/orion/data-management/questions" component={Questions} />
    <Route path="/orion/data-management/import" component={Import} />
    <Redirect to={'/orion/data-management/import'} />
  </Switch>
)

export default DataManagement
