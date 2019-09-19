import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { withApollo } from 'react-apollo'

import Sidebar from './Sidebar'

import MasterLists from './MasterLists'
import Tools from './Tools'

import { SELECT_INDICATION } from './../api/mutations'

class Orion extends React.Component {
  state = {
    isLoading: true,
  }

  // TODO: Not sure if needed anymore 
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
          <Route path={'/orion/lists'} component={MasterLists} />
          <Route path={'/orion/tools'} component={Tools} />
          <Redirect to={'/orion/lists/treatment-plans'} />
        </Switch>
      </div>
    )
  }
}

export default withApollo(Orion)
