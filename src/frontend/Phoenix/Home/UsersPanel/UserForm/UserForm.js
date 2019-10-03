import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled";
import _ from 'lodash'

import { Mutation, Query, withApollo } from 'react-apollo'

import Spinner from '../../../shared/Spinner'
import { GET_CLIENT_TEAMS } from '../../../../api/queries'

const UserFormContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: 300,
})

const Label = styled.label({
  fontWeight: 700,
})

class UserForm extends React.Component {
  constructor(props) {
    super(props)

    const {
      selectedTeamId,
      allTeamsUserIsOn,
      username,
      email,
    } = props

    let checkboxesMap = allTeamsUserIsOn.reduce((acc, { _id }) => {
      acc[_id] = true
      return acc
    }, {})

    if (selectedTeamId) checkboxesMap[selectedTeamId] = true

    this.state = {
      username,
      email,
      password: '',
      checkboxesMap,
    }
  }

  handleChange = e => {
    const { checkboxesMap } = this.state

    if (e.target.type === 'checkbox') {
      const newCheckedStatus = !checkboxesMap[e.target.id]

      this.setState({
        checkboxesMap: _.merge({}, checkboxesMap, { [e.target.id]: newCheckedStatus })
      })
    } else {
      this.setState({ [e.target.name]: e.currentTarget.value })
    }
  }

  render() {
    const {
      username,
      email,
      password,
      checkboxesMap,
    } = this.state

    const {
      userId,
      afterSubmitHook,
      mutationDoc,
      additionalFormData,
      client,
      clientMutation,
    } = this.props

    const updateMutationCallback = (
      store,
      { data }
    ) => client.mutate({
      mutation: clientMutation,
      variables: { data },
    })

    // pick out only the checked boxes and get array of ids
    const teamsToPersistOnSubmit = Object.keys(_.pickBy(checkboxesMap, value => value))

    return (
      <UserFormContainer>
        <Label>username</Label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={this.handleChange}
          autoComplete="off"
        />

        <Label>email</Label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={this.handleChange}
          autoComplete="off"
        />

        <Label>password</Label>
        <div style={{ fontSize: 10 }}>
          (if updating user, leave blank to keep unchanged)
        </div>
        <input
          type="password"
          name="password"
          value={password}
          onChange={this.handleChange}
          autoComplete="off"
        />

        <Label>teams</Label>

        <Query query={GET_CLIENT_TEAMS}>
          {({ data, loading, error }) => {
            if (loading || _.isEmpty(data)) return <Spinner />

            return (
              <>
                {
                  data.teams.map(({ _id, name }) => (
                    <div key={_id}>
                      <label>{name}</label>
                      <input
                        type='checkbox'
                        id={_id}
                        checked={Boolean(checkboxesMap[_id])}
                        onChange={this.handleChange}
                      />
                    </div>
                  ))
                }
              </>
            )
          }}
        </Query>

        <Mutation
          mutation={mutationDoc}
          update={updateMutationCallback}
        >
          {(handleSubmit, { loading, error }) => {
            if (loading) return <Spinner />
            if (error) return <div style={{ color: 'red' }}>Error processing request</div>

            return (
              <button
                style={{ marginTop: 20 }}
                type="submit"
                onClick={() => handleSubmit({
                  variables: {
                    input: {
                      _id: userId, // only needed for update, not create
                      username,
                      email,
                      password,
                      roles: teamsToPersistOnSubmit,
                      ...additionalFormData,
                    }
                  },
                }).then(afterSubmitHook)}
              >
                Submit
              </button>
            )
          }}
        </Mutation>
      </UserFormContainer>
    )
  }
}

UserForm.propTypes = {
  userId: PropTypes.string,
  username: PropTypes.string,
  email: PropTypes.string,
  selectedTeamId: PropTypes.string,
  allTeamsUserIsOn: PropTypes.array,
  afterSubmitHook: PropTypes.func,
  mutationDoc: PropTypes.object,
  clientMutation: PropTypes.object,
  additionalFormData: PropTypes.object,
}

UserForm.defaultProps = {
  userId: null,
  username: '',
  email: '',
  selectedTeamId: null,
  allTeamsUserIsOn: [],
  afterSubmitHook: () => null,
  mutationDoc: null,
  clientMutation: null,
  additionalFormData: {},
}

export default withApollo(UserForm)
