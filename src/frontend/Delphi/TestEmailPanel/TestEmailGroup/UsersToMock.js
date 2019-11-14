import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'

import { GET_USERS } from '../../../api/queries'

const formatUserForReactSelect = ({ _id, username, client }) => {
  // ! HACK: There should always be a client on the user object.
  // ! Remove this hack after https://dedhamgroup.atlassian.net/browse/PULS-4746
  let clientName = ''
  if (client) clientName = client.description

  return { label: `${username} (${clientName})`, value: _id }
}

const UsersToMock = ({ usersToMock, handleChange }) => {
  const { data, loading, error } = useQuery(GET_USERS)

  if (loading) return 'Loading...'
  if (error) return 'Error!'

  const { users } = data
  const usersById = _.keyBy(users, '_id')

  const defaultValue = usersToMock.reduce((acc, _id) => {
    const hydratedUserObj = usersById[_id]

    // it's possible for a test group to fall behind after a user
    // is deleted in Phoenix
    if (!hydratedUserObj) {
      console.error('user by id', _id, 'doesn\'t exist, skipping')
      return acc
    }

    const { username, client } = hydratedUserObj

    acc.push(formatUserForReactSelect({ _id, username, client }))
    return acc
  }, [])

  const options = users.map(formatUserForReactSelect)

  return (
    <Select
      defaultValue={defaultValue}
      isMulti
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={handleChange}
    />
  )
}

UsersToMock.propTypes = {
  usersToMock: PropTypes.arrayOf(PropTypes.string),
  handleChange: PropTypes.func,
}

UsersToMock.defaultProps = {
  usersToMock: [],
  handleChange: null,
}

export default UsersToMock
