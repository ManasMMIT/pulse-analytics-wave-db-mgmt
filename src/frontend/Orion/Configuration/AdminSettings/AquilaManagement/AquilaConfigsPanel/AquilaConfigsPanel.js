import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import queryString from 'query-string'
import _ from 'lodash'
import { transparentize } from 'polished'

import { Colors } from '../../../../../utils/pulseStyles'
import PanelItem from './PanelItem'
import ModalButtonWithForm from './ModalButtonWithForm'
import DeleteButton from '../shared/DeleteButton'

import {
  ListContainer,
  ListHeader,
  ListTitle,
  StyledUnorderedList,
} from '../shared/styledComponents'

import {
  CREATE_AQUILA_CONFIG,
  DELETE_AQUILA_CONFIG,
  UPDATE_AQUILA_CONFIG,
} from '../../../../../api/mutations'

import {
  GET_BUSINESS_OBJECTS,
  GET_AQUILA_CONFIGS,
} from '../../../../../api/queries'

// ? copied from phoenix users panel team boxes
const boBoxStyle = {
  margin: '0px 4px',
  background: transparentize(0.85, Colors.MEDIUM_GRAY_2),
  borderRadius: 2,
  color: Colors.MEDIUM_GRAY_2,
  fontSize: '10px',
  fontWeight: 500,
  lineHeight: '16px',
  padding: '2px 4px',
}

const getSearchParams = aquilaConfigObj => {
  const aquilaConfigIdObj = aquilaConfigObj ? { aquilaConfigId: aquilaConfigObj._id } : {}

  const fieldIdObj = aquilaConfigObj && aquilaConfigObj.fields[0]
    ? { fieldId: aquilaConfigObj.fields[0]._id }
    : {}

  return {
    ...aquilaConfigIdObj,
    ...fieldIdObj,
  }
}

const AquilaConfigsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const selectedAquilaConfigId = (
    location.search
    && queryString.parse(location.search)
    && queryString.parse(location.search).aquilaConfigId
  ) || ''

  const { data, loading } = useQuery(GET_AQUILA_CONFIGS)
  const { data: boData, loading: boLoading } = useQuery(GET_BUSINESS_OBJECTS)

  const handleClick = aquilaConfigObj => {
    history.push({
      search: queryString.stringify(
        getSearchParams(aquilaConfigObj)
      ),
    })
  }

  useEffect(() => {
    if (!selectedAquilaConfigId && !loading) {
      const firstAquilaConfig = data.aquilaConfigs[0]

      handleClick(firstAquilaConfig)
    }
  }, [loading, selectedAquilaConfigId])

  if (loading || boLoading) return 'Loading...'

  const businessObjectsById = _.keyBy(boData.businessObjects, '_id')

  const getBoLabel = aquilaConfigObj => {
    const underlyingBusinessObject = businessObjectsById[aquilaConfigObj.boId]

    return (
      <>
        <div>{aquilaConfigObj.label}</div>
        <div style={boBoxStyle}>
          {underlyingBusinessObject.name}
        </div>
      </>
    )
  }

  return (
    <ListContainer style={{ width: '33.3%' }}>
      <ListHeader>
        <ListTitle>Query Tool Config Object</ListTitle>
        <ModalButtonWithForm
          buttonLabel="+"
          mutationDoc={CREATE_AQUILA_CONFIG}
          afterMutationHook={handleClick}
          modalTitle="Create Query Tool Config Object"
        />
      </ListHeader>

      <StyledUnorderedList>
        {
          data.aquilaConfigs.map(aquilaConfigObj => (
            <PanelItem
              key={aquilaConfigObj._id}
              isSelected={aquilaConfigObj._id === selectedAquilaConfigId}
              bomLabel={getBoLabel(aquilaConfigObj)}
              handleClick={() => handleClick(aquilaConfigObj)}
            >
              <ModalButtonWithForm
                buttonLabel="Edit"
                data={aquilaConfigObj}
                modalTitle="Update Query Tool Config Object"
                mutationDoc={UPDATE_AQUILA_CONFIG}
                afterMutationHook={handleClick}
                mutationVars={{ _id: aquilaConfigObj._id }}
                style={{ fontSize: 10, padding: '4px 8px', marginRight: 8, }}
              />

              <DeleteButton
                mutationVars={{ _id: aquilaConfigObj._id }}
                mutationDoc={DELETE_AQUILA_CONFIG}
                afterMutationHook={() => {
                  const nextSelection = data.aquilaConfigs.find(({ _id }) => _id !== aquilaConfigObj._id)
                  if (nextSelection) handleClick(nextSelection)
                }}
              />
            </PanelItem>
          ))
        }
      </StyledUnorderedList>
    </ListContainer>
  )
}

export default AquilaConfigsPanel
