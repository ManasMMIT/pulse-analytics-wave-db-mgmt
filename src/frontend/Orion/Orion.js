import React from 'react'
import { withApollo } from 'react-apollo'
import { Route, Switch, Redirect } from 'react-router-dom'

import { SELECT_INDICATION } from './../api/mutations'

import DataManagement from './DataManagement'
import MasterLists from './MasterLists'
import Sidebar from './Sidebar'

class Orion extends React.Component {
  state = {
    isLoading: true,
  }

  componentDidMount() {
    const { client } = this.props

    client.mutate({ mutation: SELECT_INDICATION })
      .then(() => this.setState({ isLoading: false }))
  }

  render() {
    if (this.state.isLoading) return null

    return (
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Switch>
          {/* <Route exact path="/orion" component={Home} /> */}
          <Route path="/orion/lists" component={MasterLists} />
          <Route path="/orion/data-management" component={DataManagement} />
          <Redirect to={'/orion/data-management'} />
        </Switch>
      </div>
    )
  }
}

export default withApollo(Orion)
