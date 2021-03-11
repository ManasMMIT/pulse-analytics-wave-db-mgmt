import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'

const SelectedEntityDescription = ({
  style,
  queryDoc,
}) => {
  const { data, loading } = useQuery(queryDoc)

  if (loading) return null

  const firstKey = Object.keys(data)[0]
  const { description } = data[firstKey]

  return (
    <span style={style}>
      {description}
    </span>
  )
}

SelectedEntityDescription.propTypes = {
  style: PropTypes.object,
}

export default SelectedEntityDescription
