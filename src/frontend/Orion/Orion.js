import React from 'react'
import { useApolloClient } from '@apollo/react-hooks'
import { Route, Switch, Redirect } from 'react-router-dom'

import { SELECT_INDICATION } from './../api/mutations'

import Query from './Query'
import Excel from './Excel'
import Organizations from './Organizations'
import Configuration from './Configuration'

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
          <Route path="/orion/query" component={Query} />
          <Route path="/orion/excel" component={Excel} />
          <Route path="/orion/organizations" component={Organizations} />
          <Route path="/orion/configuration" component={Configuration} />
          <Redirect to={'/orion/excel'} />
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
