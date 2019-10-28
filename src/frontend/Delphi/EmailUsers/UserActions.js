import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'

import Spinner from '../../Phoenix/shared/Spinner'

import UserForm from './UserForm'
import UserTable from './UserTable'
import { REMOVE_TAB } from './utils'

import { CREATE_EMAIL_USERS, DELETE_EMAIL_USERS } from '../../api/mutations'

const ButtonsWrapper = styled.section({
  display: 'flex',
  justifyContent: ' space-evenly',
  paddingTop: 24,
})

const UserWrapper = styled.section({
  display: 'flex',
  margin: 12,
})

const UserActions = ({ 
  selectedTab,
  users,
  setUsers,
 }) => {
  const [
    createEmailUsers,
    { loading: createLoading, error: createError },
  ] = useMutation(CREATE_EMAIL_USERS)

  const [
    deleteEmailUsers,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_EMAIL_USERS)

  if (createLoading || deleteLoading) return <Spinner />
  if (createError || deleteError) {
    return <div style={{ color: 'red' }}>Error processing request</div>
  }
  
  const handleSubmit = users => {
    const action =
      selectedTab === REMOVE_TAB ? deleteEmailUsers : createEmailUsers

    if (!_.isEmpty(users)) {
      action({
        variables: {
          input: {
            users,
          },
        },
      })
      setUsers([])
    }
  }

  const addUser = user => {
    const newUsersArr = [...users, user]
    setUsers(newUsersArr)
  }

  const removeUser = index => {
    const newUsersArr = [...users]
    newUsersArr.splice(index, 1)
    setUsers(newUsersArr)
  }

  return (
    <>
      <UserWrapper>
        <UserForm addUser={addUser} selectedTab={selectedTab} />
        <UserTable data={users} removeUser={removeUser} />
      </UserWrapper>
      <ButtonsWrapper>
        <button onClick={() => handleSubmit(users)}>{selectedTab}</button>
      </ButtonsWrapper>
    </>
  )
}

export default UserActions
