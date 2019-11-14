import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import CreatableMultiSelect from '../../../Orion/shared/CreatableMultiSelect'

import EmailSubscriptions from './EmailSubscriptions'
import UsersToMock from './UsersToMock'
import DeleteButton from '../../../Orion/shared/DeleteButton'
import SendButton from '../../shared/SendButton'

import { GET_TEST_EMAIL_GROUPS } from '../../../api/queries'

const Wrapper = styled.div({
  padding: 24,
  border: '1px solid black',
  maxWidth: 700,
})

const InputSection = styled.div({
  marginBottom: 16,
  display: 'flex',
  flexDirection: 'column',
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
      <input
        style={{ fontSize: 24 }}
        type="text"
        name="name"
        onChange={handleNameChange}
        value={name}
      />
    </InputSection>

    <InputSection>
      <label>Email Subscriptions:</label>
      <EmailSubscriptions
        emailSubscriptions={emailSubscriptions}
        handleChange={toggleSubscription}
      />
    </InputSection>

    <InputSection>
      <label>Users to Mock:</label>
      <UsersToMock
        usersToMock={usersToMock}
        handleChange={updateMockUsers}
      />
    </InputSection>

    <InputSection>
      <label>Recipients:</label>

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
      />

      <SendButton
        data={{
          input: {
            _id: groupId,
            name,
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
