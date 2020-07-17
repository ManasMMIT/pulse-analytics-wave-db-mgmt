import React from 'react'

import useDevProviderInfluencers from 'frontend/Orion/Configuration/People/useDevProviderInfluencers'
import DataSections from './DataSections'

const ProviderInfluencerWidget = ({ entity }) => {
  let { data, loading } = useDevProviderInfluencers({ personId: entity._id })

  if (loading) return null

  const dataWithFieldsRemoved = data.map(
    ({ _id, personId, slug, ...rest }) => rest
  )

  return (
    <DataSections
      data={dataWithFieldsRemoved}
      title={'Provider Influencer Data'}
    />
  )
}

export default ProviderInfluencerWidget
