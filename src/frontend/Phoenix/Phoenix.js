import React, { Component } from 'react'
import { withApollo } from 'react-apollo'

import { GET_CLIENTS, GET_SELECTED_CLIENT } from './../api/queries'
import { SELECT_CLIENT } from './../api/mutations'

import ClientsPanel from './ClientsPanel'
import TeamsPanel from './TeamsPanel'
import UsersPanel from './UsersPanel'

class Phoenix extends Component {
  state = {
    isLoading: true,
  }

  componentDidMount() {
    const { client } = this.props

    client.query({ query: GET_CLIENTS })
      .then(() => client.mutate({ mutation: SELECT_CLIENT }))
      .then(() => client.query({ query: GET_SELECTED_CLIENT }))
      .then(() => this.setState({ isLoading: false }))
  }

  render() {
    if (this.state.isLoading) return null

    return (
      <div style={{ display: "flex" }}>
        <ClientsPanel />
        <TeamsPanel />
        <UsersPanel />
      </div>
    )
  }
}

export default withApollo(Phoenix)
