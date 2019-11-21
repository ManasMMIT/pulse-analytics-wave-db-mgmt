import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import Spinner from '../../Phoenix/shared/Spinner'

import ModalButtonWithForm from '../../Orion/shared/ModalButtonWithForm'
import { GET_USERS } from '../../api/queries'

import { Colors, Spacing } from '../../utils/pulseStyles'

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const buttonStyle = {
  background: Colors.PRIMARY,
  color: Colors.WHITE,
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
}

const getSendButtonInputFields = (state, handleChange) => {
  return (
    <>
      <span>Select month/year: </span>
      <input
        name="date"
        type="month"
        value={state.date}
        onChange={handleChange}
        style={{ marginBottom: Spacing.LARGE }}
      />
    </>
  )
}

const SendButtonWithHydratedUsers = ({
  data,
  mutationDoc,
}) => {
  const { data: usersData, loading, error } = useQuery(GET_USERS)

  if (loading) return <Spinner />
  if (error) return 'Error!'

  const { users } = usersData
  const usersById = _.keyBy(users, '_id')

  const dataCopy = _.cloneDeep(data)

  dataCopy.input.usersToMock = dataCopy.input.usersToMock.reduce((acc, _id) => {
    const hydratedUserObj = usersById[_id]

    // it's possible for a test group to fall behind after a user
    // is deleted in Phoenix
    if (!hydratedUserObj) {
      console.error('user by id', _id, 'doesn\'t exist, skipping')
      return acc
    }

    const { username, client } = hydratedUserObj
    const { __typename, ...clientWithoutTypename } = client

    acc.push({ _id, username, client: clientWithoutTypename })
    return acc
  }, [])

  return (
    <ModalButtonWithForm
      data={dataCopy}
      formStyle={formStyle}
      mutationDoc={mutationDoc}
      buttonLabel="Send Test Email"
      buttonStyle={buttonStyle}
      modalTitle="Send Test Email"
      getInputFields={getSendButtonInputFields}
    />
  )
}

const SendButton = ({
  data,
  mutationDoc,
}) => {
  if (data.input.usersToMock) {
    return (
      <SendButtonWithHydratedUsers
        data={data}
        mutationDoc={mutationDoc}
      />
    )
  }

  return (
    <ModalButtonWithForm
      data={data}
      formStyle={formStyle}
      mutationDoc={mutationDoc}
      buttonLabel="Send Email"
      buttonStyle={buttonStyle}
      modalTitle="Send Email"
      getInputFields={getSendButtonInputFields}
    />
  )
}

SendButton.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
}

SendButton.defaultProps = {
  data: { input: {} },
  mutationDoc: {},
}

export default SendButton
