import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  useQuery,
} from '@apollo/react-hooks'

import {
  GET_CLIENT_TEAMS,
} from '../../../../api/queries'

import Spinner from '../../../shared/Spinner'

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
            <label>{name}</label>
            <input
              type='checkbox'
              id={_id}
              checked={Boolean(checkboxesMap[_id])}
              onChange={handleChange}
            />
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
