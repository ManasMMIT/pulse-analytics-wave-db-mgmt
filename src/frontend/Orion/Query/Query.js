import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'

import NewQueryTool from './NewQueryTool'
import QueryTool from './QueryTool'
import Questions from './Questions'

const Query = () => (
  <Switch>
    <Route path="/orion/query/tool-demo" component={QueryTool} />
    <Route path="/orion/query/tool" component={NewQueryTool} />
    <Route path="/orion/query/questions" component={Questions} />
    <Redirect to={'/orion/query/tool'} />
  </Switch>
)

export default Query
