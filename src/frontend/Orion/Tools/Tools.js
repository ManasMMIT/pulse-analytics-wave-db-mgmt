import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

// import Pathways from './Pathways'
import Payer from './Payer'
// import Provider from './Provider'

const Tools = () => (
  <Switch>
    {/* <Route path={'/orion/tools/pathways'} component={Pathways} /> */}
    <Route path={'/orion/tools/payer'} component={Payer} />
    {/* <Route path={'/orion/tools/provider'} component={Provider} /> */}
    {/* <Redirect to={'/orion/tools/pathways'} /> */}
  </Switch>
)

export default Tools
