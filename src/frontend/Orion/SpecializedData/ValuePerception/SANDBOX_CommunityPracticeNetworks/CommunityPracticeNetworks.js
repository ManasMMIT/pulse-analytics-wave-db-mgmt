import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_COMMUNITY_PRACTICE_NETWORKS } from 'frontend/api/queries'
import { CREATE_COMMUNITY_PRACTICE_NETWORK } from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

import UpdateAndDeleteCommunityPracticeNetwork from './UpdateAndDeleteCommunityPracticeNetwork'

const CommunityPracticeNetworks = () => {
  const [stagedInput, setStagedInput] = useState({
    name: '',
  })

  const {
    data: communityPracticeNetworksData,
    loading: communityPracticeNetworksLoading,
  } = useQuery(GET_COMMUNITY_PRACTICE_NETWORKS)

  const [createCommunityPracticeNetwork] = useMutation(
    CREATE_COMMUNITY_PRACTICE_NETWORK,
    {
      variables: {
        input: {
          name: stagedInput.name,
        },
      },
      update: (cache, { data: { createVegaCommunityPracticeNetwork } }) => {
        const newCommunityPracticeNetworks = [
          ...communityPracticeNetworksData.vegaCommunityPracticeNetworks,
          createVegaCommunityPracticeNetwork,
        ]
        cache.writeQuery({
          query: GET_COMMUNITY_PRACTICE_NETWORKS,
          data: { vegaCommunityPracticeNetworks: newCommunityPracticeNetworks },
        })
      },
      onError: alert,
    }
  )

  if (communityPracticeNetworksLoading) return <div>Loading...</div>

  const handleNameChange = (e) => {
    setStagedInput({ ...stagedInput, name: e.target.value })
  }

  return (
    <div>
      <h1>Community Practice Networks</h1>
      <h2>Create Community Practice Network</h2>
      <div>
        <input
          style={{
            background: Color.LIGHT_BLUE_GRAY_2,
            padding: 12,
            margin: 5,
          }}
          placeholder="Enter name..."
          onChange={handleNameChange}
          value={stagedInput.name}
        />
        <Button onClick={createCommunityPracticeNetwork}>
          Create Community Practice Network
        </Button>
      </div>
      <h2>All Community Practice Networks</h2>
      {communityPracticeNetworksData.vegaCommunityPracticeNetworks.map(
        (communityPracticeNetwork) => (
          <UpdateAndDeleteCommunityPracticeNetwork
            key={communityPracticeNetwork.id}
            communityPracticeNetwork={communityPracticeNetwork}
          />
        )
      )}
    </div>
  )
}

export default CommunityPracticeNetworks
