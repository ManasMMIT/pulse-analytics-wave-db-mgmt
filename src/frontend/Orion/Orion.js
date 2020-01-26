import React from 'react'
import { useApolloClient } from '@apollo/react-hooks'
import { Route, Switch, Redirect } from 'react-router-dom'

import { SELECT_INDICATION } from './../api/mutations'

import DataManagement from './DataManagement'
import MasterLists from './MasterLists'
import Sidebar from './Sidebar'

import TestUserAction from './TestUserAction'

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
          <Route path="/orion/data-management/TEST_USER_ACTION" component={TestUserAction} />
          <Route path="/orion/data-management" component={DataManagement} />
          <Route path="/orion/lists" component={MasterLists} />
          <Redirect to={'/orion/data-management/query'} />
        </Switch>
      </div>
    )
  }
}

const OrionContainer = () => {
  const client = useApolloClient()
  return <Orion client={client} />
}

export default OrionContainer
