import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import DataManagement from './DataManagement'
import MasterLists from './MasterLists'

const Orion = () => {
  return (
    <div style={{ flex: 1 }}>
      <Switch>
        <Route exact path="/orion" component={Home} />
        <Route path="/orion/master-lists" component={MasterLists} />
        <Route path="/orion/data-management" component={DataManagement} />
      </Switch>
    </div>
  )
}

export default Orion
