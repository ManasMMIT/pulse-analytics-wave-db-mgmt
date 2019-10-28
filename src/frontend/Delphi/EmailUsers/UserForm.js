import React, { useState } from 'react'
import styled from '@emotion/styled'

import { ADD_TEST_TAB, REMOVE_TAB } from './utils'

const DEFAULT_USER = {
  email: '',
  username: '',
  isPulseTest: false,
  isTdgTest: false,
}

const FormWrapper = styled.div({
  width: '30%',
})

const FormItem = styled.div({
  padding: `6px 0`,
})

const VAL_CHECKS = new Set(['username', 'email'])

const UserForm = ({ addUser, selectedTab }) => {
  const [user, setUser] = useState(DEFAULT_USER)
  const { email, username, isPulseTest, isTdgTest } = user

  const handleSubmit = e => {
    e.preventDefault()
    addUser(user)
    setUser(DEFAULT_USER)
  }

  const handleChange = event => {
    const { name, checked, value } = event.target

    setUser({
      ...user,
      [name]: VAL_CHECKS.has(name) ? value : checked,
    })
  }

  const formLabel = selectedTab === REMOVE_TAB ? 'Username or Email' : 'Username'

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit}>
        {selectedTab === ADD_TEST_TAB ? (
          <>
            <FormItem>
              <label htmlFor="email">Email</label>
              <br />
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </FormItem>
            <FormItem>
              <label htmlFor="username">Username to Source</label>
              <br />
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </FormItem>
            <FormItem>
              <label htmlFor="pulse">Pulse Test User</label>
              <input
                id="pulse"
                type="checkbox"
                name="isPulseTest"
                checked={isPulseTest}
                onChange={handleChange}
              />
            </FormItem>
            <FormItem>
              <label htmlFor="tdg">TDG Test User</label>
              <input
                id="tdg"
                type="checkbox"
                name="isTdgTest"
                checked={isTdgTest}
                onChange={handleChange}
              />
            </FormItem>
          </>
        ) : (
          <>
            <FormItem>
              <label htmlFor="username">{ formLabel }</label>
              <br />
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </FormItem>
          </>
        )}
        <button type="submit">Stage</button>
      </form>
    </FormWrapper>
  )
}

export default UserForm
