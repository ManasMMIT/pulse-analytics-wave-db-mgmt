import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled";
import _ from 'lodash'

import Checkboxes from './Checkboxes'
import SubmitButton from './SubmitButton';

const UserFormWrapper = styled.div({
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
      additionalFormData,
      mutationDoc,
      clientMutation,
    } = this.props

    // pick out only the checked boxes and get array of ids
    const teamsToPersistOnSubmit = Object.keys(_.pickBy(checkboxesMap, value => value))

    const submitData = {
      _id: userId, // only needed for update, not create
      username,
      email,
      password,
      roles: teamsToPersistOnSubmit,
      ...additionalFormData,
    }

    return (
      <UserFormWrapper>
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
        <Checkboxes
          checkboxesMap={checkboxesMap}
          handleChange={this.handleChange}
        />
        <SubmitButton
          mutationDoc={mutationDoc}
          afterSubmitHook={afterSubmitHook}
          clientMutation={clientMutation}
          input={submitData}
        />
      </UserFormWrapper>
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
  additionalFormData: PropTypes.object,
}

UserForm.defaultProps = {
  userId: null,
  username: '',
  email: '',
  selectedTeamId: null,
  allTeamsUserIsOn: [],
  afterSubmitHook: () => null,
  additionalFormData: {},
}

export default UserForm
