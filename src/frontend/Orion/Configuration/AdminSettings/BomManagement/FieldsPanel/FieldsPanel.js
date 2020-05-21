import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'

import FieldPanelItem from './FieldPanelItem'

import CreateButtonWithForm from './CreateButtonWithForm'
import UpdateForm from './UpdateForm'
import DeleteButton from '../shared/DeleteButton'
import {
  ListContainer,
  ListHeader,
  ListTitle,
  UpdateFormLabel,
  StyledUnorderedList,
  StyledNavHeader,
} from '../shared/styledComponents'

import { Colors } from 'frontend/utils/pulseStyles'

import { GET_BOM_CONFIGS } from 'frontend/api/queries'

import {
  CREATE_BOM_CONFIG_FIELD,
  DELETE_BOM_CONFIG_FIELD,
  UPDATE_BOM_CONFIG_FIELD,
 } from 'frontend/api/mutations'

const FieldsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const {
    bomId: selectedBomId,
    sectionId: selectedSectionId,
    tabId: selectedTabId,
    fieldId: selectedFieldId,
  } = (
    location.search
    && queryString.parse(location.search)
  ) || {}

  const { data, loading } = useQuery(GET_BOM_CONFIGS)

  const handleClick = fieldObj => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = { ...prevQueryParams, fieldId: fieldObj._id }

    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  if (loading) return 'Loading...'

  const selectedBom = data.bomConfigs.find(({ _id }) => (
    _id === selectedBomId
  ))

  const tabs = selectedBom ? selectedBom.tags : []

  const selectedTab = tabs.find(({ _id }) => (
    _id === selectedTabId
  ))

  const sections = selectedTab ? selectedTab.sections : []

  const selectedSection = sections.find(({ _id }) => (
    _id === selectedSectionId
  ))

  const fields = selectedSection ? selectedSection.fields : []

  const selectedField = fields.find(({ _id}) => (
    _id === selectedFieldId
  ))

  return (
    <div style={{ display: 'flex', width: '50%' }}>
      <ListContainer style={{ width: '50%' }}>
        <ListHeader>
          <ListTitle>
            <span>Fields / </span>
            <StyledNavHeader>{(selectedSection || {}).label}</StyledNavHeader>
          </ListTitle>
          <CreateButtonWithForm
            selectedBom={selectedBom}
            mutationDoc={CREATE_BOM_CONFIG_FIELD}
            mutationVars={{
              modalId: selectedBomId,
              tagId: selectedTabId,
              sectionId: selectedSectionId,
            }}
            modalTitle='Create Field'
            afterMutationHook={handleClick}
          />
        </ListHeader>

        <StyledUnorderedList>
          {
            fields.map(fieldObj => (
              <FieldPanelItem
                key={fieldObj._id}
                isSelected={fieldObj._id === selectedFieldId}
                fieldLabel={fieldObj.label}
                handleClick={() => handleClick(fieldObj)}
              >
                <DeleteButton
                  selectedBom={selectedBom}
                  mutationDoc={DELETE_BOM_CONFIG_FIELD}
                  mutationVars={{
                    modalId: selectedBomId,
                    tagId: selectedTabId,
                    sectionId: selectedSectionId,
                    fieldId: fieldObj._id
                  }}
                  afterMutationHook={() => {
                    const nextFieldSelection = fields.find(({ _id }) => _id !== fieldObj._id)

                    if (nextFieldSelection) handleClick(nextFieldSelection) // breaks if no fields are left
                  }}

                />
              </FieldPanelItem>
            ))
          }
        </StyledUnorderedList>
      </ListContainer>

      <div style={{ width: '50%', background: Colors.LIGHT_BLUE_GRAY_2, }}>
        <UpdateFormLabel>Update Field</UpdateFormLabel>
        <UpdateForm
          key={selectedFieldId}
          data={selectedField}
          selectedBom={selectedBom}
          mutationDoc={UPDATE_BOM_CONFIG_FIELD}
          mutationVars={{
            fieldId: selectedFieldId,
            modalId: selectedBomId,
            tagId: selectedTabId,
            sectionId: selectedSectionId,
          }}
        />
      </div>
    </div>
  )
}

export default FieldsPanel
