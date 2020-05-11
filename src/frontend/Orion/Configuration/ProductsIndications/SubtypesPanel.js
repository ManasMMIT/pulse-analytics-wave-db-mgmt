import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from 'frontend/components/Panel'
import {
  GET_SOURCE_TREATMENT_PLANS,
  GET_POPULATIONS,
} from 'frontend/api/queries'

import {
  DELETE_POPULATION,
  CREATE_POPULATION,
  UPDATE_POPULATION,
} from 'frontend/api/mutations'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

import ModalButtonWithForm from '../../shared/ModalButtonWithForm'
import DeleteButton from '../../shared/DeleteButton'

import {
  StyledInput,
  FormLabel,
  createObjectModalStyle,
  defaultPanelItemStyle
} from '../../Organizations/styledComponents'


const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Subtype'

const CREATE_MODAL_TITLE = 'Create New Subtype'

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
      mutationDoc={CREATE_POPULATION}
      refetchQueries={[{ query: GET_POPULATIONS }]}
      getInputFields={getInputFields}
    />
  </div>
)

const getButtonGroupCallback = treatmentPlansByPopulation => population => (
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
      {`(${(treatmentPlansByPopulation[population.name] || []).length} Treatment Plans)`}
    </span>
    <ModalButtonWithForm
      modalTitle="Edit Subtype"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      modalStyle={createObjectModalStyle}
      data={{ input: population }}
      mutationDoc={UPDATE_POPULATION}
      refetchQueries={[{ query: GET_POPULATIONS }]}
      getInputFields={getInputFields}
    />
    <DeleteButton
      itemId={population._id}
      mutationDoc={DELETE_POPULATION}
      refetchQueries={[{ query: GET_POPULATIONS }]}
    />
  </>
)


const SubtypesPanel = () => {
  const { data, loading } = useQuery(GET_SOURCE_TREATMENT_PLANS)

  if (loading) return null

  const { treatmentPlans } = data

  const treatmentPlansByPopulation = _.groupBy(treatmentPlans, 'population')

  const buttonGroupCallback = getButtonGroupCallback(treatmentPlansByPopulation)

  const panelItemConfig = {
    style: defaultPanelItemStyle,
    buttonGroupCallback,
    label1Callback: ({ name }) => name,
  }

  return (
    <Panel
      title="Subtypes"
      headerChildren={headerChildren}
      headerContainerStyle={{
        background: Color.WHITE,
        borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`
      }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_POPULATIONS },
      }}
      panelItemConfig={panelItemConfig}
    />
  )
}

export default SubtypesPanel
