import React, { useState } from 'react'
import _ from 'lodash'
import { useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Spinner from 'frontend/components/Spinner'
import { Colors, Spacing } from 'frontend/utils/pulseStyles'
import DeleteButton from 'frontend/Orion/shared/DeleteButton'
import { customSelectStyles } from 'frontend/components/customSelectStyles'

import {
  StyledCardButton,
  TitleInput,
  InputSection,
  StyledLabel,
} from './styledComponents'

import {
  GET_DEV_COLLECTION_NAMES,
  GET_DEV_TO_PROD_PUSH_CONFIGS,
} from 'frontend/api/queries'

import {
  UPDATE_DEV_TO_PROD_PUSH_CONFIG,
  DELETE_DEV_TO_PROD_PUSH_CONFIG,
  PUSH_DEV_TO_PROD,
} from 'frontend/api/mutations'

const Wrapper = styled.div({
  background: Colors.WHITE,
  borderRadius: 4,
  padding: Spacing.EXTRA_LARGE,
})

const DataPushConfig = ({ _id, name, collections }) => {
  const [configName, setConfigName] = useState(name)
  const [selectedCollections, selectCollections] = useState(collections)
  const [areChangesSaved, toggleSaveStatus] = useState(true)

  const [updateConfig, { loading: savingChanges }] = useMutation(
    UPDATE_DEV_TO_PROD_PUSH_CONFIG,
    {
      variables: {
        input: {
          _id,
          name: configName,
          collections: selectedCollections,
        },
      },
      refetchQueries: [{ query: GET_DEV_TO_PROD_PUSH_CONFIGS }],
      awaitRefetchQueries: true,
      onCompleted: () => toggleSaveStatus(true),
    }
  )

  const [pushDevToProd, { loading: pushingData }] = useMutation(
    PUSH_DEV_TO_PROD,
    {
      variables: {
        input: {
          _id,
          isPushAll: false,
          name: configName,
        },
      },
    }
  )

  const { data, loading } = useQuery(GET_DEV_COLLECTION_NAMES)

  if (loading) return 'Loading'

  const { collections: devCollectionNames } = data

  return (
    <Wrapper>
      <InputSection>
        <StyledLabel>Collection Group Name</StyledLabel>
        <TitleInput
          type="text"
          name="name"
          placeholder="Click to name this group of collections"
          onChange={(e) => {
            setConfigName(e.currentTarget.value)
            toggleSaveStatus(false)
          }}
          value={configName}
        />
      </InputSection>

      <InputSection>
        <StyledLabel>Collections</StyledLabel>
        <Select
          styles={customSelectStyles}
          isMulti
          options={devCollectionNames.map((name) => ({
            label: name,
            value: name,
          }))}
          value={selectedCollections.map((name) => ({
            label: name,
            value: name,
          }))}
          onChange={(options) => {
            let newSelectedCollections = []

            if (!_.isEmpty(options)) {
              newSelectedCollections = options.map(({ value }) => value)
            }

            selectCollections(newSelectedCollections)
            toggleSaveStatus(false)
          }}
        />
      </InputSection>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <DeleteButton
          mutationDoc={DELETE_DEV_TO_PROD_PUSH_CONFIG}
          refetchQueries={[{ query: GET_DEV_TO_PROD_PUSH_CONFIGS }]}
          itemId={_id}
          modalTitle="Are you sure you want to delete this configuration?"
        />

        {areChangesSaved ? (
          <StyledCardButton onClick={pushDevToProd}>
            {pushingData ? <Spinner fill="white" /> : 'Push to Prod'}
          </StyledCardButton>
        ) : (
          <StyledCardButton
            onClick={updateConfig}
            buttonStyle={{ background: 'red' }}
          >
            {savingChanges ? <Spinner fill="white" /> : 'Save Changes'}
          </StyledCardButton>
        )}
      </div>
    </Wrapper>
  )
}

DataPushConfig.propTypes = {
  _id: PropTypes.string,
  name: PropTypes.string,
  collections: PropTypes.arrayOf(PropTypes.string),
}

DataPushConfig.defaultProps = {
  _id: null,
  name: null,
  collections: [],
}

export default DataPushConfig
