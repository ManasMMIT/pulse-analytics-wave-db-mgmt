import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'
import _ from 'lodash'
import { transparentize } from 'polished'

import { Colors } from '../../../../../utils/pulseStyles'
import BomPanelItem from './BomPanelItem'
import ModalButtonWithForm from './ModalButtonWithForm'
import DeleteButton from '../shared/DeleteButton'

import {
  ListContainer,
  ListHeader,
  ListTitle,
  StyledUnorderedList,
} from '../shared/styledComponents'

import {
  CREATE_BOM_CONFIG,
  DELETE_BOM_CONFIG,
  UPDATE_BOM_CONFIG,
} from '../../../../../api/mutations'

import {
  GET_BUSINESS_OBJECTS,
  GET_BOM_CONFIGS,
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

const getBomTagSectionField = (bom) => {
  const bomIdObj = bom ? { bomId: bom._id } : {}

  const firstTab = bom ? bom.tags[0] : undefined
  const tabIdObj = firstTab ? { tabId: firstTab._id } : {}

  const firstSection = firstTab ? firstTab.sections[0] : undefined
  const sectionIdObj = firstSection ? { sectionId: firstSection._id } : {}

  const fieldIdObj =
    firstSection && firstSection.fields[0]
      ? { fieldId: firstSection.fields[0]._id }
      : {}

  return {
    ...bomIdObj,
    ...tabIdObj,
    ...sectionIdObj,
    ...fieldIdObj,
  }
}

const BomsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const selectedBomId =
    (location.search &&
      queryString.parse(location.search) &&
      queryString.parse(location.search).bomId) ||
    ''

  const { data, loading } = useQuery(GET_BOM_CONFIGS)
  const { data: boData, loading: boLoading } = useQuery(GET_BUSINESS_OBJECTS)

  const handleClick = (bomObj) => {
    history.push({
      search: queryString.stringify(getBomTagSectionField(bomObj)),
    })
  }

  useEffect(() => {
    if (!selectedBomId && !loading) {
      const firstBom = data.bomConfigs[0]

      handleClick(firstBom)
    }
  }, [loading, selectedBomId])

  if (loading || boLoading) return 'Loading...'
  const businessObjectsById = _.keyBy(boData.businessObjects, '_id')

  const getBomLabel = (bomObj) => {
    const underlyingBusinessObject = businessObjectsById[bomObj.boId]

    return (
      <>
        <div>{bomObj.label}</div>
        <div style={boBoxStyle}>{underlyingBusinessObject.name}</div>
      </>
    )
  }

  return (
    <ListContainer style={{ width: '25%' }}>
      <ListHeader>
        <ListTitle>Business Object Modals</ListTitle>
        <ModalButtonWithForm
          buttonLabel="+"
          mutationDoc={CREATE_BOM_CONFIG}
          afterMutationHook={handleClick}
          modalTitle="Create Business Object Modal"
        />
      </ListHeader>

      <StyledUnorderedList>
        {data.bomConfigs.map((bomObj) => (
          <BomPanelItem
            key={bomObj._id}
            isSelected={bomObj._id === selectedBomId}
            bomLabel={getBomLabel(bomObj)}
            handleClick={() => handleClick(bomObj)}
          >
            <ModalButtonWithForm
              buttonLabel="Edit"
              data={bomObj}
              modalTitle="Update Business Object Modal"
              mutationDoc={UPDATE_BOM_CONFIG}
              afterMutationHook={handleClick}
              mutationVars={{ modalId: selectedBomId }}
              style={{ fontSize: 10, padding: '4px 8px', marginRight: 8 }}
            />

            <DeleteButton
              mutationVars={{ modalId: bomObj._id }}
              mutationDoc={DELETE_BOM_CONFIG}
              afterMutationHook={() => {
                const nextBomSelection = data.bomConfigs.find(
                  ({ _id }) => _id !== bomObj._id
                )
                handleClick(nextBomSelection)
              }}
            />
          </BomPanelItem>
        ))}
      </StyledUnorderedList>
    </ListContainer>
  )
}

export default BomsPanel
