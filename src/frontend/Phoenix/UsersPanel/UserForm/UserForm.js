import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled";
import _ from 'lodash'

import { Mutation, Query } from 'react-apollo'

import Spinner from '../../shared/Spinner'
import { GET_CLIENT_TEAMS } from '../../../api/queries'

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

    let checkboxesMap = allTeamsUserIsOn.reduce((acc, { id }) => {
      acc[id] = true
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
    } = this.props

    // pick out only the checked boxes and get array of ids
    const teamsToPersistOnSubmit = Object.keys(_.pickBy(checkboxesMap, value => value))

    return (
      <UserFormContainer>
        <Label>username</Label>
        <input type="text" name="username" value={username} onChange={this.handleChange} />

        <Label>email</Label>
        <input type="text" name="email" value={email} onChange={this.handleChange} />

        <Label>password</Label>
        <div style={{ fontSize: 10 }}>
          (if updating user, leave blank to keep unchanged)
        </div>
        <input type="password" name="password" value={password} onChange={this.handleChange} />

        <Label>teams</Label>

        <Query query={GET_CLIENT_TEAMS}>
          {({ data, loading, error }) => {
            if (_.isEmpty(data)) return <Spinner />

            return (
              <>
                {
                  data.teams.map(({ id, name }) => (
                    <div key={id}>
                      <label>{name}</label>
                      <input
                        type='checkbox'
                        id={id}
                        checked={Boolean(checkboxesMap[id])}
                        onChange={this.handleChange}
                      />
                    </div>
                  ))
                }
              </>
            )
          }}
        </Query>

        <Mutation mutation={mutationDoc}>
          {(handleSubmit, { loading }) => {
            if (loading) return <Spinner />

            return (
              <button
                style={{ marginTop: 20 }}
                type="submit"
                onClick={() => handleSubmit({
                  variables: {
                    id: userId, // only needed for update, not create
                    username,
                    email,
                    password,
                    roles: teamsToPersistOnSubmit,
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
}

UserForm.defaultProps = {
  userId: null,
  username: '',
  email: '',
  selectedTeamId: null,
  allTeamsUserIsOn: [],
  afterSubmitHook: () => null,
  mutationDoc: null,
}

export default UserForm
