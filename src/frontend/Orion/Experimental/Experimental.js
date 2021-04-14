import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import QueryTool from './Query'

const Experimental = () => (
  <Switch>
    <Route path={'/orion/experimental/query-tool'} component={QueryTool} />
    <Redirect to={'/orion/experimental/query-tool'} />
  </Switch>
)

export default Experimental
