import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import PlacardView from './PlacardView'
import PqlView from './PqlView'

const NewQueryTool = () => (
  <Switch>
    <Route path={"/orion/query/tool/placard"} component={PlacardView} />
    <Route path={"/orion/query/tool/pql"} component={PqlView} />
    <Redirect to={"/orion/query/tool/placard"} />
  </Switch>
)

export default NewQueryTool
