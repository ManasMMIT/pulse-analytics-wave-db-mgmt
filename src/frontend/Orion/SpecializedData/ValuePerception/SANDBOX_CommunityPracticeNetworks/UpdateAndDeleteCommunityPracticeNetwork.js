import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_COMMUNITY_PRACTICE_NETWORKS } from 'frontend/api/queries'
import {
  UPDATE_COMMUNITY_PRACTICE_NETWORK,
  DELETE_COMMUNITY_PRACTICE_NETWORK,
} from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

const UpdateAndDeleteCommunityPracticeNetwork = ({
  communityPracticeNetwork,
}) => {
  const [stagedInput, setStagedInput] = useState({
    name: communityPracticeNetwork.name,
  })

  const [updateCommunityPracticeNetwork] = useMutation(
    UPDATE_COMMUNITY_PRACTICE_NETWORK,
    {
      variables: {
        input: {
          id: communityPracticeNetwork.id,
          name: stagedInput.name,
        },
      },
      onError: alert,
    }
  )

  const [deleteCommunityPracticeNetwork] = useMutation(
    DELETE_COMMUNITY_PRACTICE_NETWORK,
    {
      variables: {
        input: {
          id: communityPracticeNetwork.id,
        },
      },
      update: (cache) => {
        const { vegaCommunityPracticeNetworks } = cache.readQuery({
          query: GET_COMMUNITY_PRACTICE_NETWORKS,
        })
        const newCommunityPracticeNetworks = vegaCommunityPracticeNetworks.filter(
          ({ id }) => id !== communityPracticeNetwork.id
        )
        cache.writeQuery({
          query: GET_COMMUNITY_PRACTICE_NETWORKS,
          data: { vegaCommunityPracticeNetworks: newCommunityPracticeNetworks },
        })
      },
      onError: alert,
    }
  )

  const handleNameChange = (e) => {
    setStagedInput({ ...stagedInput, name: e.target.value })
  }

  return (
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
      <Button onClick={updateCommunityPracticeNetwork}>
        Update Community Practice Network
      </Button>
      <Button onClick={deleteCommunityPracticeNetwork}>
        Delete Community Practice Network
      </Button>
    </div>
  )
}

export default UpdateAndDeleteCommunityPracticeNetwork
