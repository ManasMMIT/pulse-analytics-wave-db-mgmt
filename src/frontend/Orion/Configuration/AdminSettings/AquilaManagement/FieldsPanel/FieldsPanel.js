import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
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

import { GET_AQUILA_CONFIGS } from 'frontend/api/queries'

import {
  CREATE_AQUILA_CONFIG_FIELD,
  DELETE_AQUILA_CONFIG_FIELD,
  UPDATE_AQUILA_CONFIG_FIELD,
} from 'frontend/api/mutations'

const FieldsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const {
    aquilaConfigId: selectedAquilaConfigId,
    fieldId: selectedFieldId,
  } = (
    location.search
    && queryString.parse(location.search)
  ) || {}

  const { data, loading } = useQuery(GET_AQUILA_CONFIGS)

  const handleClick = fieldObj => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = { ...prevQueryParams, fieldId: fieldObj._id }

    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  if (loading) return 'Loading...'

  const selectedAquilaConfig = data.aquilaConfigs.find(({ _id }) => (
    _id === selectedAquilaConfigId
  ))

  const fields = selectedAquilaConfig ? selectedAquilaConfig.fields : []

  const selectedField = fields.find(({ _id }) => (
    _id === selectedFieldId
  ))

  return (
    <div style={{ display: 'flex', width: '66.6%' }}>
      <ListContainer style={{ width: '50%' }}>
        <ListHeader>
          <ListTitle>
            <span>Fields / </span>
            <StyledNavHeader>{(selectedAquilaConfig || {}).label}</StyledNavHeader>
          </ListTitle>

          <CreateButtonWithForm
            selectedAquilaConfig={selectedAquilaConfig}
            mutationDoc={CREATE_AQUILA_CONFIG_FIELD}
            mutationVars={{
              aquilaConfigId: selectedAquilaConfigId,
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
                  mutationDoc={DELETE_AQUILA_CONFIG_FIELD}
                  mutationVars={{
                    aquilaConfigId: selectedAquilaConfigId,
                    _id: fieldObj._id
                  }}
                  afterMutationHook={() => {
                    const nextFieldSelection = fields.find(({ _id }) => _id !== fieldObj._id)
                    if (nextFieldSelection) handleClick(nextFieldSelection) // breaks if no fields are left
                  }}
                  boId={selectedAquilaConfig.boId}
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
          selectedAquilaConfig={selectedAquilaConfig}
          mutationDoc={UPDATE_AQUILA_CONFIG_FIELD}
          mutationVars={{
            _id: selectedFieldId,
            aquilaConfigId: selectedAquilaConfigId,
          }}
        />
      </div>
    </div>
  )
}

export default FieldsPanel
