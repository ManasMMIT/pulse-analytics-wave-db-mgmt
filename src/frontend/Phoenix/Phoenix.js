import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { useApolloClient } from '@apollo/react-hooks' // option 3: react-hooks, PROB UNRELIABLE

import { GET_CLIENTS, GET_SOURCE_TOOLS } from './../api/queries'
import { SELECT_CLIENT, SELECT_TOOL } from './../api/mutations'

import Home from './Home'
import SitemapPanel from './SitemapPanel'
class Phoenix extends Component {
  state = {
    isLoading: true,
  }

  componentDidMount() {
    const { client } = this.props

    client.query({ query: GET_CLIENTS })
      .then(() => client.mutate({ mutation: SELECT_CLIENT }))
      .then(() => client.query({ query: GET_SOURCE_TOOLS }))
      .then(() => client.mutate({ mutation: SELECT_TOOL }))
      .then(() => this.setState({ isLoading: false }))
  }

  render() {
    if (this.state.isLoading) return null

    return (
      <div style={{ flex: 1, }}>
        <Switch>
          <Route exact path="/phoenix" component={Home} />
          <Route path="/phoenix/sitemap/:teamId" component={SitemapPanel} />
        </Switch>
      </div>
    )
  }
}

const PhoenixContainer = () => {
  const client = useApolloClient()
  return <Phoenix client={client} />
}

export default PhoenixContainer
