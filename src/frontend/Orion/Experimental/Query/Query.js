import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import QueryTool from './QueryTool'
import NewQueryTool from './NewQueryTool'
import Questions from './Questions'

const Query = () => (
  <Switch>
    <Route
      path="/orion/experimental/query-tool/tool-demo"
      component={QueryTool}
    />
    <Route
      path="/orion/experimental/query-tool/tool"
      component={NewQueryTool}
    />
    <Route
      path="/orion/experimental/query-tool/questions"
      component={Questions}
    />
    <Redirect to={'/orion/experimental/query-tool/query'} />
  </Switch>
)

export default Query
