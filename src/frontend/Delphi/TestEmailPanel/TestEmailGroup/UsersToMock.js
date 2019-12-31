import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import { transparentize } from 'polished'

import Spinner from '../../../Phoenix/shared/Spinner'

import { GET_USERS } from '../../../api/queries'

import { Colors, Spacing } from '../../../utils/pulseStyles'

const formatUserForReactSelect = ({ _id, username, client }) => {
  // ! HACK: There should always be a client on the user object.
  // ! Remove this hack after https://dedhamgroup.atlassian.net/browse/PULS-4746
  let clientName = ''
  if (client) clientName = client.description

  return { label: `${username} (${clientName})`, value: _id }
}

const UsersToMock = ({ usersToMock, handleChange }) => {
  const { data, loading, error } = useQuery(
    GET_USERS,
    {
      fetchPolicy: 'network-only'
    }
  )

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Spinner />
      <p style={{ color: Colors.PRIMARY, fontSize: 12, fontWeight: 600, marginLeft: Spacing.SMALL }}>
        Loading Users
      </p>
    </div>
  )
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

  const customStyles = {
    control: (provided,) => ({
      ...provided,
      borderRadius: 4,
      border: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
    }),
    multiValue: () => ({
      background: transparentize(0.9, Colors.BLACK),
      borderRadius: 4,
      display: 'flex',
      marginRight: Spacing.SMALL
    }),
    multiValueLabel: () => ({
      fontSize: 12,
      color: Colors.BLACK,
      marginLeft: Spacing.TINY,
      padding: Spacing.TINY,
    }),
    placeholder: () => ({
      fontSize: 12,
      color: transparentize(0.7, Colors.BLACK),
    }),
    menuList: (provided) => ({
      ...provided,
      fontSize: 12,
    }),
    input: (provided) => ({
      ...provided,
      fontSize: 12,
    }),
  }

  return (
    <Select
      defaultValue={defaultValue}
      isMulti
      options={options}
      styles={customStyles}
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
