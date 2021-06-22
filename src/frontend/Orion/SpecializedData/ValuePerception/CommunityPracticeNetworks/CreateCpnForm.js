import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { GET_COMMUNITY_PRACTICE_NETWORKS } from 'frontend/api/queries'
import { CREATE_COMMUNITY_PRACTICE_NETWORK } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import {
  InputSection,
  FormLabel,
} from '../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const CreateCdnForm = ({ closeHandler }) => {
  const [cdnName, setCdnName] = useState('')

  const {
    data: communityPracticeNetworksData,
    loading: communityPracticeNetworksLoading,
  } = useQuery(GET_COMMUNITY_PRACTICE_NETWORKS)

  const [
    createCommunityPracticeNetwork,
    { loading: mutationLoading },
  ] = useMutation(CREATE_COMMUNITY_PRACTICE_NETWORK, {
    variables: {
      input: {
        name: cdnName,
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
    onCompleted: () => {
      closeHandler()
    },
  })

  const onTextChange = ({ value }) => {
    setCdnName(value)
  }

  const isLoading = communityPracticeNetworksLoading || mutationLoading

  return (
    <SingleActionDialog
      header={'Create Community Practice Network'}
      submitText="Create Network"
      submitHandler={createCommunityPracticeNetwork}
      cancelHandler={closeHandler}
    >
      <div style={{ padding: `${Spacing.S4} ${Spacing.S7} ${Spacing.S7}` }}>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <form>
              <InputSection>
                <FormLabel>Name (required)</FormLabel>
                <Input
                  name="name"
                  type="text"
                  value={cdnName}
                  onChange={onTextChange}
                />
              </InputSection>
            </form>
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

CreateCdnForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
}

export default CreateCdnForm
