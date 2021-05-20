import React from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { useQuery } from '@apollo/react-hooks'

import { GET_TEAMS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'

const TeamCheckboxes = ({ checkboxesMap, handleChange }) => {
  const location = useLocation()

  const { clientId: selectedClientId } =
    (location.search && queryString.parse(location.search)) || {}

  const { data, loading } = useQuery(GET_TEAMS, {
    variables: { clientId: selectedClientId },
  })

  if (loading || _.isEmpty(data)) return <Spinner />

  return (
    <>
      {data.teams.map(({ _id, name }) => (
        <div key={_id}>
          <input
            type="checkbox"
            id={_id}
            checked={Boolean(checkboxesMap[_id])}
            onChange={handleChange}
          />
          <label style={{ paddingLeft: 8 }}>{name}</label>
        </div>
      ))}
    </>
  )
}

TeamCheckboxes.propTypes = {
  checkboxesMap: PropTypes.object,
  handleChange: PropTypes.func,
}

export default TeamCheckboxes
