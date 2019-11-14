import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import _ from 'lodash'
import gql from 'graphql-tag'

import TestEmailGroup from './TestEmailGroup'

import { GET_TEST_EMAIL_GROUPS } from '../../../api/queries'
import {
  UPDATE_TEST_EMAIL_GROUP,
  DELETE_TEST_EMAIL_GROUP,
} from '../../../api/mutations'

const DUMMY_MUTATION = gql`
  mutation asdf($input: asdf!) {
    asdf(input: $input) {
      blah
    }
  }
`

const isEmailValid = email => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const TestEmailGroupContainer = ({
  _id,
  name,
  recipients,
  usersToMock,
  emailSubscriptions,
}) => {
  const testEmailGroup = {
    _id,
    name,
    recipients,
    usersToMock,
    emailSubscriptions,
  }

  const [updateTestEmailGroup] = useMutation(
    UPDATE_TEST_EMAIL_GROUP,
    {
      refetchQueries: [{ query: GET_TEST_EMAIL_GROUPS }]
    },
  )

  const handlers = {
    handleNameChange: e => updateTestEmailGroup({
      variables: {
        input: _.merge({}, testEmailGroup, { name: e.target.value })
      }
    }),
    toggleSubscription: subscriptionId => {
      const testEmailGroupCopy = _.cloneDeep(testEmailGroup)

      const updatedEmailSubscriptions = testEmailGroupCopy.emailSubscriptions

      const targetIdx = updatedEmailSubscriptions.findIndex(_id => {
        return _id === subscriptionId
      })

      if (targetIdx === -1) {
        // only use the _id as we only want to store that in the DB
        updatedEmailSubscriptions.push(subscriptionId)
      } else {
        updatedEmailSubscriptions.splice(targetIdx, 1)
      }

      updateTestEmailGroup({ variables: { input: testEmailGroupCopy } })
    },
    updateMockUsers: updatedMockUsers => {
      updatedMockUsers = updatedMockUsers || []

      const testEmailGroupCopy = _.cloneDeep(testEmailGroup)

      const usersToPersist = updatedMockUsers.map(({ value }) => value)
      testEmailGroupCopy.usersToMock = usersToPersist

      updateTestEmailGroup({ variables: { input: testEmailGroupCopy } })
    },
    updateRecipients: updatedRecipients => {
      updatedRecipients = updatedRecipients || []

      const testEmailGroupCopy = _.cloneDeep(testEmailGroup)

      const invalidEmails = []

      const recipientsToPersist = updatedRecipients.reduce((acc, { value }) => {
        if (!isEmailValid(value)) invalidEmails.push(value)

        acc.push(value)
        return acc
      }, [])

      if (invalidEmails.length) {
        alert(`Invalid email: '${invalidEmails.join(', ')}'. Failed to write to DB. REFRESH BROWSER.`)
        return
      }

      testEmailGroupCopy.recipients = recipientsToPersist
      updateTestEmailGroup({ variables: { input: testEmailGroupCopy } })
    }
  }

  const mutationDocs = {
    deleteGroup: DELETE_TEST_EMAIL_GROUP,
    sendEmail: DUMMY_MUTATION,
  }

  return (
    <TestEmailGroup
      testEmailGroup={testEmailGroup}
      handlers={handlers}
      mutationDocs={mutationDocs}
    />
  )
}

TestEmailGroupContainer.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string,
  recipients: PropTypes.arrayOf(PropTypes.string),
  usersToMock: PropTypes.arrayOf(PropTypes.string),
  emailSubscriptions: PropTypes.arrayOf(PropTypes.string),
}

TestEmailGroupContainer.defaultProps = {
  name: null,
  recipients: [],
  usersToMock: [],
  emailSubscriptions: [],
}

export default TestEmailGroupContainer
