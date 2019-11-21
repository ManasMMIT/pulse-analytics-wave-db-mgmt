import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import CreatableMultiSelect from '../../../Orion/shared/CreatableMultiSelect'

import EmailSubscriptions from './EmailSubscriptions'
import UsersToMock from './UsersToMock'
import DeleteButton from '../../../Orion/shared/DeleteButton'
import SendButton from '../../shared/SendButton'

import { GET_TEST_EMAIL_GROUPS } from '../../../api/queries'

import { Colors, Spacing, Transitions } from '../../../utils/pulseStyles'

const Wrapper = styled.div({
  background: Colors.WHITE,
  borderRadius: 4,
  padding: Spacing.EXTRA_LARGE,
})

const InputSection = styled.div({
  marginBottom: 16,
  display: 'flex',
  flexDirection: 'column',
})

const TestGroupTitle = styled.input({
  fontSize: 16,
  fontWeight: 600,
  padding: `${Spacing.SMALL}`,
  borderRadius: 4,
  border: '1px solid',
  borderColor: transparentize(0.9, Colors.BLACK),
  carotColor: Colors.PRIMARY,
  transition: Transitions.NORMAL,
  ':focus': {
    borderColor: Colors.PRIMARY,
    outline: 'none',
    boxShadow: `0 0 0 1px ${Colors.PRIMARY}`
  },
  ':hover': {
    borderColor: Colors.PRIMARY,
  },
  '::placeholder': {
    color: transparentize(0.7, Colors.BLACK),
  }
})

const StyledLabel = styled.label({
  fontSize: 12,
  lineHeight: '22px',
  fontWeight: 600,
  color: Colors.BLACK,
  marginBottom: Spacing.TINY,
})

const TestEmailGroup = ({
  handlers: {
    handleNameChange,
    toggleSubscription,
    updateMockUsers,
    updateRecipients,
  },
  testEmailGroup: {
    _id: groupId,
    name,
    recipients,
    emailSubscriptions,
    usersToMock,
  },
  mutationDocs: { deleteGroup, sendEmail }
}) => (
  <Wrapper>
    <InputSection>
      <TestGroupTitle
        type="text"
        name="name"
        placeholder="Click to name the test group"
        onChange={handleNameChange}
        value={name}
      />
    </InputSection>

    <InputSection>
      <StyledLabel>Email Subscriptions:</StyledLabel>
      <EmailSubscriptions
        emailSubscriptions={emailSubscriptions}
        handleChange={toggleSubscription}
      />
    </InputSection>

    <InputSection>
      <StyledLabel>Users to Mock:</StyledLabel>
      <UsersToMock
        usersToMock={usersToMock}
        handleChange={updateMockUsers}
      />
    </InputSection>

    <InputSection>
      <StyledLabel>Recipients:</StyledLabel>

      <CreatableMultiSelect
        value={recipients.map(name => ({ value: name, label: name }))}
        handleChange={updateRecipients}
      />
    </InputSection>

    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <DeleteButton
        mutationDoc={deleteGroup}
        refetchQueries={[{query: GET_TEST_EMAIL_GROUPS }]}
        itemId={groupId}
        modalTitle="Are you sure you want to delete this email test group?"
      />

      <SendButton
        data={{
          input: {
            recipients,
            emailSubscriptions,
            usersToMock,
          } }}
        mutationDoc={sendEmail}
      />
    </div>
  </Wrapper>
)

TestEmailGroup.propTypes = {
  testEmailGroup: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  mutationDocs: PropTypes.object.isRequired,
}

TestEmailGroup.defaultProps = {
  testEmailGroup: {},
}

export default TestEmailGroup
