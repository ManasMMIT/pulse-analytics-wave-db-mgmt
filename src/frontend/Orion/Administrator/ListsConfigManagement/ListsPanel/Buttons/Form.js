import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import Select from 'react-select'

import {
  FieldContainer,
  FormLabel,
  StyledInput,
  StyledButton,
} from '../../shared/styledComponents'

import { getSelectedDashboardTool } from '../../utils'

const FORM_LABELS = {
  LIST_ID_LABEL: 'List Id (Required)',
  NODE_ID_LABEL: 'Node Id',
  TITLE_LABEL: 'Title (Required)',
  LIST_INFO_LABEL: 'List Info (Tooltip)',
  LOCATION_LABEL: 'Location',
  NOTE_LABEL: 'Note',
  TYPE_LABEL: 'Type',
  DASHBOARD_TOOL_LABEL: 'Dashboard Tool',
}
const TYPE_OPTIONS = [
  undefined,
  'Tabular List',
  'Icon List',
  'Paragraph List',
  'Numbered List',
  'Tile List',
  'Bulleted List',
]
const SUBMIT_LABEL = 'Submit'

const Form = ({ data, mutationFunction }) => {
  const _id = (data || {})._id

  const [stagedListId, setListId] = useState(data.listId)
  const [stagedNodeId, setNodeId] = useState(data.nodeId)
  const [stagedListTitle, setListTitle] = useState(data.listTitle)
  const [stagedListInfo, setListInfo] = useState(data.listInfo)
  const [stagedMeta, setMeta] = useState(
    data.meta
      ? {
          location: data.meta.location,
          note: data.meta.note,
          type: data.meta.type,
        }
      : {}
  )

  const location = useLocation()
  const selectedDashboardTool = getSelectedDashboardTool(location)

  const input = {
    _id,
    listId: stagedListId,
    nodeId: stagedNodeId,
    listTitle: stagedListTitle,
    listInfo: stagedListInfo,
    meta: stagedMeta,
    dashboardTool: selectedDashboardTool,
  }

  const handleListIdChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setListId(value)
  }

  const handleNodeIdChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setNodeId(value)
  }

  const handleListTitleChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setListTitle(value)
  }

  const handleListInfoChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setListInfo(value)
  }

  const handleLocationChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setMeta((previousState) => ({
      ...previousState,
      location: value,
    }))
  }

  const handleNoteChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setMeta((previousState) => ({
      ...previousState,
      note: value,
    }))
  }

  const handleTypeSelection = (obj) => {
    const type = obj.value || null
    setMeta((previousState) => ({
      ...previousState,
      type: type,
    }))
  }

  const typeOptions = TYPE_OPTIONS.map((type) => ({
    label: type === undefined ? '(BLANK)' : type,
    value: type,
  }))

  return (
    <>
      <FieldContainer>
        <FormLabel>{FORM_LABELS.LIST_ID_LABEL}</FormLabel>
        <StyledInput
          type="text"
          value={stagedListId}
          onChange={handleListIdChange}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.NODE_ID_LABEL}</FormLabel>
        <StyledInput
          type="text"
          value={stagedNodeId}
          onChange={handleNodeIdChange}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.TITLE_LABEL}</FormLabel>
        <StyledInput
          type="text"
          value={stagedListTitle}
          onChange={handleListTitleChange}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.LIST_INFO_LABEL}</FormLabel>
        <StyledInput
          type="text"
          value={stagedListInfo}
          onChange={handleListInfoChange}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.LOCATION_LABEL}</FormLabel>
        <StyledInput
          type="text"
          value={stagedMeta ? stagedMeta.location : undefined}
          onChange={handleLocationChange}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.NOTE_LABEL}</FormLabel>
        <StyledInput
          type="text"
          value={stagedMeta ? stagedMeta.note : undefined}
          onChange={handleNoteChange}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.TYPE_LABEL}</FormLabel>
        <Select
          styles={{ container: (base) => ({ ...base, flex: 1 }) }}
          value={{
            label: stagedMeta.type || undefined,
            value: stagedMeta.type || undefined,
          }}
          defaultValue={typeOptions[0]}
          onChange={handleTypeSelection}
          options={typeOptions}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.DASHBOARD_TOOL_LABEL}</FormLabel>
        <Select
          styles={{ container: (base) => ({ ...base, flex: 1 }) }}
          value={{
            label: selectedDashboardTool,
            value: selectedDashboardTool,
          }}
          isDisabled
        />
      </FieldContainer>

      <StyledButton onClick={() => mutationFunction({ variables: { input } })}>
        {SUBMIT_LABEL}
      </StyledButton>
    </>
  )
}

Form.propTypes = {
  data: PropTypes.object,
  mutationFunction: PropTypes.func,
}

Form.defaultProps = {
  data: {},
  mutationFunction: () => {},
}

export default Form
