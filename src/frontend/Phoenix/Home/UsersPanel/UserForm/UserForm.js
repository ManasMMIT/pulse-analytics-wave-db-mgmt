import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled"
import _ from 'lodash'
import { transparentize } from 'polished'

import TeamCheckboxes from './TeamCheckboxes'
import SubmitButton from './SubmitButton'
import EmailSubscriptions from './EmailSubscriptions'
import { pathwaysEmailSubscription } from './email-subscription-options'
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
  textTransform: 'capitalize'
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
  }
})

class UserForm extends React.Component {
  constructor(props) {
    super(props)

    const {
      selectedTeamId,
      allTeamsUserIsOn,
      userData: {
        username,
        email,
        emailSubscriptions,
      },
    } = props

    let checkboxesMap = allTeamsUserIsOn.reduce((acc, { _id }) => {
      acc[_id] = true
      return acc
    }, {})

    if (selectedTeamId) checkboxesMap[selectedTeamId] = true

    this.state = {
      username,
      email,
      emailSubscriptions: emailSubscriptions || [],
      password: '',
      checkboxesMap,
    }
  }

  handleTextChange = e => {
    this.setState({ [e.target.name]: e.currentTarget.value })
  }

  handleTeamCheckboxesChange = e => {
    const { checkboxesMap } = this.state

    const newCheckedStatus = !checkboxesMap[e.target.id]

    this.setState({
      checkboxesMap: _.merge({}, checkboxesMap, { [e.target.id]: newCheckedStatus })
    })
  }

  handleEmailSubscriptionsChange = e => {
    const { emailSubscriptions } = this.state

    const emailSubscriptionsCopy = _.cloneDeep(emailSubscriptions)

    const targetIdx = emailSubscriptionsCopy.findIndex(({ _id }) => {
      return _id === e.target.id
    })

    if (targetIdx === -1) {
      emailSubscriptionsCopy.push(pathwaysEmailSubscription)
    } else {
      emailSubscriptionsCopy.splice(targetIdx, 1)
    }

    this.setState({ emailSubscriptions: emailSubscriptionsCopy })
  }

  render() {
    const {
      username,
      email,
      emailSubscriptions,
      password,
      checkboxesMap,
    } = this.state

    const {
      userData: { _id: userId },
      afterSubmitHook,
      additionalFormData,
      mutationDoc,
      clientMutation,
      selectedTeamId,
    } = this.props

    // pick out only the checked boxes and get array of ids
    const teamsToPersistOnSubmit = Object.keys(_.pickBy(checkboxesMap, value => value))

    const submitData = {
      _id: userId, // only needed for update, not create
      username,
      email,
      password,
      roles: teamsToPersistOnSubmit,
      emailSubscriptions: stripTypename(emailSubscriptions),
      ...additionalFormData,
    }

    return (
      <UserFormWrapper>
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
            type="password"
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

        <SubmitButton
          mutationDoc={mutationDoc}
          afterSubmitHook={afterSubmitHook}
          clientMutation={clientMutation}
          input={submitData}
          selectedTeamId={selectedTeamId}
        />
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
  }),
  selectedTeamId: PropTypes.string,
  allTeamsUserIsOn: PropTypes.array,
  afterSubmitHook: PropTypes.func,
  additionalFormData: PropTypes.object,
  clientMutation: PropTypes.object,
}

UserForm.defaultProps = {
  userData: {
    _id: null, // for create user, _id has to be null bc undefined fetches all teams
  },
  selectedTeamId: null,
  allTeamsUserIsOn: [],
  afterSubmitHook: () => null,
  additionalFormData: {},
  clientMutation: null,
}

export default UserForm
