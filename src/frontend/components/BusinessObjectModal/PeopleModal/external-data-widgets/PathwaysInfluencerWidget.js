import React from 'react'
import styled from '@emotion/styled'

import useDevPathwaysInfluencers from 'frontend/Orion/Configuration/People/useDevPathwaysInfluencers'
import DataSections from './DataSections'
import Spinner from 'frontend/components/Spinner'

const SpinnerWrapper = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const PathwaysInfluencerWidget = ({ entity }) => {
  let { data, loading } = useDevPathwaysInfluencers({ personId: entity._id })

  if (loading) {
    return (
      <SpinnerWrapper>
        <Spinner size={28} />
      </SpinnerWrapper>
    )
  }

  const dataWithFieldsRemoved = data.map(
    ({ _id, personId, slug, ...rest }) => rest
  )

  return <DataSections data={dataWithFieldsRemoved} />
}

export default PathwaysInfluencerWidget
