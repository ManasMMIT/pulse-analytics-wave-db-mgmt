import React from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from '../../../../../Phoenix/shared/Panel'
import ModalButtonWithForm from '../../../../shared/ModalButtonWithForm'
// import DeleteButton from '../../../../shared/DeleteButton'
import CopyOneOfStringButton from '../../../../shared/CopyOneOfStringButton'
import { GET_SOURCE_QUALITY_OF_ACCESS_SCORES } from '../../../../../api/queries'
import ColorBox from '../../../../shared/ColorBox'
import QoaForm from './QoaForm'

import {
  CREATE_QUALITY_OF_ACCESS_SCORE,
  UPDATE_QUALITY_OF_ACCESS_SCORE,
  // DELETE_QUALITY_OF_ACCESS_SCORE,
} from '../../../../../api/mutations'

import { Colors } from '../../../../../utils/pulseStyles'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Quality of Access'

const CREATE_MODAL_TITLE = 'Create New Quality of Access'

const buttonStyle = {
  background: "#234768",
  color: Colors.WHITE,
}

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 24px',
  color: Colors.BLACK,
  fontWeight: 600,
  fontSize: 12,
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
}

const formStyle = { height: 500, overflowY: 'auto', fontSize: 12 }

const getInputFields = (state, handleChange) => (
  <QoaForm
    state={state}
    handleChange={handleChange}
  />
)

const headerChildren = (
  <div>
    <ModalButtonWithForm
      formStyle={formStyle}
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
      mutationDoc={CREATE_QUALITY_OF_ACCESS_SCORE}
      refetchQueries={[{ query: GET_SOURCE_QUALITY_OF_ACCESS_SCORES }]}
      getInputFields={getInputFields}
    />

    <CopyOneOfStringButton
      queryDoc={GET_SOURCE_QUALITY_OF_ACCESS_SCORES}
      dataKey='qualityOfAccessScores'
    />
  </div>
)

const buttonGroupCallback = entity => {
  const input = {
    ...entity,
    score: String(entity.score),
    sortOrder: String(entity.sortOrder),
  }

  return (
    <>
      <ModalButtonWithForm
        formStyle={formStyle}
        modalTitle="Edit Quality of Access Score"
        buttonLabel={editIcon}
        buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
        data={{ input }}
        mutationDoc={UPDATE_QUALITY_OF_ACCESS_SCORE}
        refetchQueries={[{ query: GET_SOURCE_QUALITY_OF_ACCESS_SCORES }]}
        getInputFields={getInputFields}
      />
      {/* <DeleteButton
        itemId={entity._id}
        mutationDoc={DELETE_QUALITY_OF_ACCESS_SCORE}
        refetchQueries={[{ query: GET_SOURCE_QUALITY_OF_ACCESS_SCORES }]}
      /> */}
    </>
  )
}

const label1StyleWrapper = {
  display: 'flex',
  alignItems: 'center',
  width: 400,
  justifyContent: 'space-between',
}

const panelItemConfig = {
  style: defaultPanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ access, score, color }) => (
    <div style={label1StyleWrapper}>
      <div style={{ fontSize: 12, fontWeight: 700 }}>
        {access}
      </div>
      <div>
        <ColorBox
          label={score}
          boxColor={color}
        />
      </div>
    </div>
  )
}

const QualityAccessScorePanel = () => (
  <Panel
    title="Quality of Access Scores"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: Colors.WHITE,
      borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_QUALITY_OF_ACCESS_SCORES },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default QualityAccessScorePanel
