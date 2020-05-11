import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from 'frontend/components/Panel'
import {
  GET_SOURCE_TREATMENT_PLANS,
  GET_COVERAGES,
} from 'frontend/api/queries'

import {
  DELETE_COVERAGE,
  CREATE_COVERAGE,
  UPDATE_COVERAGE,
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

const CREATE_BUTTON_TXT = 'Create Coverage Type'

const CREATE_MODAL_TITLE = 'Create New Coverage Type'

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
      mutationDoc={CREATE_COVERAGE}
      refetchQueries={[{ query: GET_COVERAGES }]}
      getInputFields={getInputFields}
    />
  </div>
)

const getButtonGroupCallback = treatmentPlansByCoverage => coverage => (
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
      {`(${(treatmentPlansByCoverage[coverage.name] || []).length} Treatment Plans)`}
    </span>
    <ModalButtonWithForm
      modalTitle="Edit Coverage Type"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      modalStyle={createObjectModalStyle}
      data={{ input: coverage }}
      mutationDoc={UPDATE_COVERAGE}
      refetchQueries={[{ query: GET_COVERAGES }]}
      getInputFields={getInputFields}
    />
    <DeleteButton
      itemId={coverage._id}
      mutationDoc={DELETE_COVERAGE}
      refetchQueries={[{ query: GET_COVERAGES }]}
    />
  </>
)


const CoveragesPanel = () => {
  const { data, loading } = useQuery(GET_SOURCE_TREATMENT_PLANS)

  if (loading) return null

  const { treatmentPlans } = data

  const treatmentPlansByCoverage = _.groupBy(treatmentPlans, 'coverage')

  const buttonGroupCallback = getButtonGroupCallback(treatmentPlansByCoverage)

  const panelItemConfig = {
    style: defaultPanelItemStyle,
    buttonGroupCallback,
    label1Callback: ({ name }) => name,
  }

  return (
    <Panel
      title="Coverage Types"
      headerChildren={headerChildren}
      headerContainerStyle={{
        background: Color.WHITE,
        borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`
      }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_COVERAGES },
      }}
      panelItemConfig={panelItemConfig}
    />
  )
}

export default CoveragesPanel
