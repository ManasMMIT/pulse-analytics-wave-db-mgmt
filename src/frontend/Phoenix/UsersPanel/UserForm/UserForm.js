import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled";
import _ from 'lodash'

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
      selectedTeam,
      allTeamsUserIsOn,
      username,
      email,
    } = props

    let checkboxesMap = allTeamsUserIsOn.reduce((acc, { id }) => {
      acc[id] = true
      return acc
    }, {})

    checkboxesMap = _.merge({}, checkboxesMap, { [selectedTeam]: true })

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
      handleSubmit,
      selectedClient,
      teams,
    } = this.props

    // pick out only the checked boxes and get array of ids
    const rolesToPersistOnSubmit = Object.keys(_.pickBy(checkboxesMap, value => value))

    const submitHandler = () => handleSubmit({
      id: userId, // only needed for update, not create
      username,
      email,
      password,
      roles: rolesToPersistOnSubmit,
      clientId: selectedClient, // only needed for create, not update
    })

    return (
      <UserFormContainer>
        <Label>username</Label>
        <input type="text" name="username" value={username} onChange={this.handleChange} />

        <Label>email</Label>
        <input type="text" name="email" value={email} onChange={this.handleChange} />

        <Label>password (leave blank to keep unchanged)</Label>
        <input type="password" name="password" value={password} onChange={this.handleChange} />

        <Label>roles</Label>

        {
          teams.map(({ id, name }) => (
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

        <button style={{ marginTop: 20 }} onClick={submitHandler}>
          Submit
        </button>
      </UserFormContainer>
    )
  }
}

UserForm.propTypes = {
  userId: PropTypes.string,
  selectedClient: PropTypes.string,
  selectedTeam: PropTypes.string,
  username: PropTypes.string,
  email: PropTypes.string,
  allTeamsUserIsOn: PropTypes.array,
  handleSubmit: PropTypes.func,
  teams: PropTypes.array,
}

UserForm.defaultProps = {
  userId: null,
  selectedClient: null,
  selectedTeam: null,
  username: '',
  email: '',
  allTeamsUserIsOn: [],
  handleSubmit: () => console.log('submit was clicked'),
  teams: [],
}

export default UserForm
