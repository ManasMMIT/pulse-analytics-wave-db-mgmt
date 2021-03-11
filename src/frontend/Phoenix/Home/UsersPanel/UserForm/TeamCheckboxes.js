import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  useQuery,
} from '@apollo/client'

import {
  GET_CLIENT_TEAMS,
} from '../../../../api/queries'

import Spinner from 'frontend/components/Spinner'

const TeamCheckboxes = ({
  checkboxesMap,
  handleChange,
}) => {
  const {
    data,
    loading,
  } = useQuery(GET_CLIENT_TEAMS)

  if (loading || _.isEmpty(data)) return <Spinner />

  return (
    <>
      {
        data.teams.map(({ _id, name }) => (
          <div key={_id}>
            <input
              type='checkbox'
              id={_id}
              checked={Boolean(checkboxesMap[_id])}
              onChange={handleChange}
            />
            <label style={{ paddingLeft: 8 }}>{name}</label>
          </div>
        ))
      }
    </>
  )
}

TeamCheckboxes.propTypes = {
  checkboxesMap: PropTypes.object,
  handleChange: PropTypes.func,
}

export default TeamCheckboxes
