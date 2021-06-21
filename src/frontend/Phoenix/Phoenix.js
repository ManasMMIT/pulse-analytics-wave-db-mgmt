import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './Home'
import SitemapPanel from './SitemapPanel'
import FullOpLog from './Home/StatusPanel/OpLog/FullOpLog'

class Phoenix extends Component {
  render() {
    return (
      <div style={{ flex: 1 }}>
        <Switch>
          <Route exact path="/phoenix" component={Home} />
          <Route
            path="/phoenix/sitemap/:clientId/:teamId"
            component={SitemapPanel}
          />
          <Route path="/phoenix/oplog" component={FullOpLog} />
        </Switch>
      </div>
    )
  }
}

export default Phoenix
