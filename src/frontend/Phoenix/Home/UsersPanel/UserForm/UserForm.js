import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import _ from 'lodash'
import { transparentize } from 'polished'

import TeamCheckboxes from './TeamCheckboxes'
import SubmitButton from './SubmitButton'
import EmailSubscriptions from './EmailSubscriptions'
import stripTypename from '../../../../Orion/shared/strip-typename'
import { Colors } from '../../../../utils/pulseStyles'

const UserFormWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: 320,
})

const InputSection = styled.div({
  marginBottom: 16,
  display: 'flex',
  flexDirection: 'column',
})

const Label = styled.label({
  fontSize: 12,
  lineHeight: '22px',
  fontWeight: 600,
  textTransform: 'capitalize',
})

const Input = styled.input({
  background: Colors.WHITE,
  border: `1px solid ${transparentize(0.96, Colors.BLACK)}`,
  borderRadius: 4,
  padding: '8px 12px',
  ':hover': {
    border: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  },
  ':focus': {
    border: `1px solid ${transparentize(0.1, Colors.PRIMARY)}`,
    outline: 'none',
  },
})

class UserForm extends React.Component {
  constructor(props) {
    super(props)

    const {
      selectedTeamId,
      allTeamsUserIsOn,
      userData: {
        firstName,
        lastName,
        username,
        email,
        emailSubscriptions,
        defaultLanding = {},
      },
    } = props

    let checkboxesMap = allTeamsUserIsOn.reduce((acc, { _id }) => {
      acc[_id] = true
      return acc
    }, {})

    if (selectedTeamId) checkboxesMap[selectedTeamId] = true

    this.state = {
      firstName,
      lastName,
      username,
      email,
      emailSubscriptions: emailSubscriptions || [],
      password: '',
      checkboxesMap,
      defaultLanding: {
        locked: (defaultLanding && defaultLanding.locked) || false,
        path: (defaultLanding && defaultLanding.path) || '',
      },
    }
  }

  handleTextChange = (e) => {
    this.setState({ [e.target.name]: e.currentTarget.value })
  }

  handleTeamCheckboxesChange = (e) => {
    const { checkboxesMap } = this.state

    const newCheckedStatus = !checkboxesMap[e.target.id]

    this.setState({
      checkboxesMap: _.merge({}, checkboxesMap, {
        [e.target.id]: newCheckedStatus,
      }),
    })
  }

  handleEmailSubscriptionsChange = (subscription) => {
    const { emailSubscriptions } = this.state
    const emailSubscriptionsCopy = _.cloneDeep(emailSubscriptions)

    const targetIdx = emailSubscriptionsCopy.findIndex(({ _id }) => {
      return _id === subscription._id
    })

    if (targetIdx === -1) {
      emailSubscriptionsCopy.push(subscription)
    } else {
      emailSubscriptionsCopy.splice(targetIdx, 1)
    }

    this.setState({ emailSubscriptions: emailSubscriptionsCopy })
  }

  handleDefaultLandingChange = (e) => {
    const { defaultLanding } = this.state

    let newDefaultLanding
    if (e.currentTarget.type === 'checkbox') {
      newDefaultLanding = _.merge({}, defaultLanding, {
        locked: e.currentTarget.checked,
      })
    } else {
      newDefaultLanding = _.merge({}, defaultLanding, {
        path: e.currentTarget.value,
      })
    }

    this.setState({ defaultLanding: newDefaultLanding })
  }

  render() {
    const {
      firstName,
      lastName,
      username,
      email,
      emailSubscriptions,
      password,
      checkboxesMap,
      defaultLanding,
    } = this.state

    const {
      userData: { _id: userId },
      afterSubmitHook,
      additionalFormData,
      mutationDoc,
      selectedTeamId,
      handleClick,
    } = this.props

    // pick out only the checked boxes and get array of ids
    const teamsToPersistOnSubmit = Object.keys(
      _.pickBy(checkboxesMap, (value) => value)
    )

    const submitData = {
      _id: userId, // only needed for update, not create
      firstName,
      lastName,
      username,
      email,
      password,
      roles: teamsToPersistOnSubmit,
      emailSubscriptions: stripTypename(emailSubscriptions),
      ...additionalFormData,
      defaultLanding,
    }

    const isDisabled = [lastName, firstName, username, email].some(
      (field) => !Boolean(field)
    )

    return (
      <UserFormWrapper>
        <InputSection>
          <Label>First Name</Label>
          <Input
            type="text"
            name="firstName"
            value={firstName}
            onChange={this.handleTextChange}
            autoComplete="off"
          />
        </InputSection>

        <InputSection>
          <Label>Last Name</Label>
          <Input
            type="text"
            name="lastName"
            value={lastName}
            onChange={this.handleTextChange}
            autoComplete="off"
          />
        </InputSection>

        <InputSection>
          <Label>username</Label>
          <Input
            type="text"
            name="username"
            value={username}
            onChange={this.handleTextChange}
            autoComplete="off"
          />
        </InputSection>

        <InputSection>
          <Label>email</Label>
          <Input
            type="text"
            name="email"
            value={email}
            onChange={this.handleTextChange}
            autoComplete="off"
          />
        </InputSection>

        <InputSection>
          <Label>password</Label>
          <div style={{ fontSize: 10 }}>
            (if updating user, leave blank to keep unchanged)
          </div>
          <Input
            type="text"
            name="password"
            value={password}
            onChange={this.handleTextChange}
            autoComplete="off"
          />
        </InputSection>

        <InputSection>
          <Label>teams</Label>
          <TeamCheckboxes
            checkboxesMap={checkboxesMap}
            handleChange={this.handleTeamCheckboxesChange}
          />
        </InputSection>

        <InputSection>
          <Label>Email Subscriptions</Label>
          <EmailSubscriptions
            emailSubscriptions={emailSubscriptions}
            handleChange={this.handleEmailSubscriptionsChange}
          />
        </InputSection>

        <InputSection>
          <Label>Default Landing Page</Label>
          <div style={{ paddingBottom: 8 }}>
            <input
              type="checkbox"
              checked={defaultLanding.locked}
              onChange={this.handleDefaultLandingChange}
            />
            <label style={{ paddingLeft: 8 }}>
              Lock Landing Page (skip teams' changes)
            </label>
          </div>
          <Input
            type="text"
            name="defaultLandingPath"
            value={defaultLanding.path}
            onChange={this.handleDefaultLandingChange}
            autoComplete="off"
          />
        </InputSection>

        <SubmitButton
          isDisabled={isDisabled}
          mutationDoc={mutationDoc}
          afterSubmitHook={afterSubmitHook}
          input={submitData}
          selectedTeamId={selectedTeamId}
          handleClick={handleClick}
        />
        {isDisabled ? (
          <div style={{ color: Colors.RED }}>
            Please fill out required fields
          </div>
        ) : null}
      </UserFormWrapper>
    )
  }
}

UserForm.propTypes = {
  userData: PropTypes.shape({
    _id: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    emailSubscriptions: PropTypes.arrayOf(PropTypes.object),
    defaultLanding: PropTypes.shape({
      path: PropTypes.string,
      locked: PropTypes.bool,
    }),
  }),
  selectedTeamId: PropTypes.string,
  allTeamsUserIsOn: PropTypes.array,
  afterSubmitHook: PropTypes.func,
  additionalFormData: PropTypes.object,
}

UserForm.defaultProps = {
  userData: {
    _id: null, // for create user, _id has to be null bc undefined fetches all teams
    defaultLanding: {},
  },
  selectedTeamId: null,
  allTeamsUserIsOn: [],
  afterSubmitHook: () => null,
  additionalFormData: {},
}

export default UserForm
