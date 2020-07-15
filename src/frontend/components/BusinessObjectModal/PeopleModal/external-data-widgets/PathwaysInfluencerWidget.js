import React from 'react'

import useDevPathwaysInfluencers from 'frontend/Orion/Configuration/People/useDevPathwaysInfluencers'
import DataSections from './DataSections'

const PathwaysInfluencerWidget = ({ entity }) => {
  let { data, loading } = useDevPathwaysInfluencers({ personId: entity._id })

  if (loading) return null

  const dataWithFieldsRemoved = data.map(
    ({ _id, personId, slug, ...rest }) => rest
  )

  return (
    <DataSections
      data={dataWithFieldsRemoved}
      title={'Pathways Influencer Data'}
    />
  )
}

export default PathwaysInfluencerWidget
