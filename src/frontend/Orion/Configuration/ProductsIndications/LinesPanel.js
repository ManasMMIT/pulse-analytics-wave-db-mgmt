import React from 'react'
import { useQuery } from '@apollo/client'
import _ from 'lodash'

import Panel from '../../../components/Panel'
import ModalButtonWithForm from '../../shared/ModalButtonWithForm'
import DeleteButton from '../../shared/DeleteButton'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import { StyledInput, FormLabel, createObjectModalStyle, defaultPanelItemStyle } from '../../Organizations/styledComponents'

import {
  GET_SOURCE_TREATMENT_PLANS,
  GET_LINES,
} from '../../../api/queries'

import {
  DELETE_LINE,
  CREATE_LINE,
  UPDATE_LINE,
} from '../../../api/mutations'

import Color from '../../../utils/color'
import Spacing from '../../../utils/spacing'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Line'

const CREATE_MODAL_TITLE = 'Create New Line'

const buttonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
}

const getInputFields = (state, handleChange) => (
  <>
    <div style={{ marginBottom: Spacing.S5 }}>
      <FormLabel>Name:</FormLabel>
      <StyledInput
        type="text"
        name="name"
        onChange={handleChange}
        value={state.input.name || ''}
      />
    </div>
  </>
)

const headerChildren = (
  <div>
    <ModalButtonWithForm
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
      modalStyle={createObjectModalStyle}
      mutationDoc={CREATE_LINE}
      refetchQueries={[{ query: GET_LINES }]}
      getInputFields={getInputFields}
    />
  </div>
)

const getButtonGroupCallback = treatmentPlansByLine => line => (
  <>
    <span
      style={{
        padding: Spacing.S2,
        margin: Spacing.S7,
        background: Color.LIGHT_BLUE_GRAY_1,
        borderRadius: 5,
        color: Color.ORION,
      }}
    >
      {`(${(treatmentPlansByLine[line.name] || []).length} Treatment Plans)`}
    </span>
    <ModalButtonWithForm
      modalTitle="Edit Line"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      modalStyle={createObjectModalStyle}
      data={{ input: line }}
      mutationDoc={UPDATE_LINE}
      refetchQueries={[{ query: GET_LINES }]}
      getInputFields={getInputFields}
    />
    <DeleteButton
      itemId={line._id}
      mutationDoc={DELETE_LINE}
      refetchQueries={[{ query: GET_LINES }]}
    />
  </>
)


const LinesPanel = () => {
  const { data, loading } = useQuery(GET_SOURCE_TREATMENT_PLANS)

  if (loading) return null

  const { treatmentPlans } = data

  const treatmentPlansByLine = _.groupBy(treatmentPlans, 'line')

  const buttonGroupCallback = getButtonGroupCallback(treatmentPlansByLine)

  const panelItemConfig = {
    style: defaultPanelItemStyle,
    buttonGroupCallback,
    label1Callback: ({ name }) => name,
  }

  return (
    <Panel
      title="Lines"
      headerChildren={headerChildren}
      headerContainerStyle={{
        background: Color.WHITE,
        borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`
      }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_LINES },
      }}
      panelItemConfig={panelItemConfig}
    />
  )
}

export default LinesPanel
