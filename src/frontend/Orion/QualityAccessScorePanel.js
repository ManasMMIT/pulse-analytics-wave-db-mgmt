import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import Panel from '../Phoenix/shared/Panel'
import ModalButtonWithForm from './shared/ModalButtonWithForm' // ! look into this
import DeleteButton from './shared/DeleteButton'
import CopyOneOfStringButton from './shared/CopyOneOfStringButton'
import { GET_SOURCE_QUALITY_ACCESS_SCORES } from './../api/queries'

import {
  CREATE_QUALITY_ACCESS_SCORE,
  // UPDATE_SOURCE_INDICATION,
  // DELETE_SOURCE_INDICATION,
} from '../api/mutations'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Quality of Access'

const CREATE_MODAL_TITLE = 'Create New Quality of Access'

const buttonStyle = {
  background: "#234768",
  color: 'white',
}

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '17px 20px',
  color: '#0E2539',
  fontWeight: 600,
  fontSize: 12,
  marginTop: 10,
  borderTop: '1px solid rgb(182, 185, 188)',
}


const getInputFields = (state, handleChange) => {
  debugger
  return (
    <div style={{
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <span>access: </span>
        <input
          type="text"
          name="access"
          onChange={handleChange}
          value={state.input.access}
        />
        <span>accessTiny: </span>
        <input
          type="text"
          name="accessTiny"
          onChange={handleChange}
          value={state.input.accessTiny}
        />
        <span>score: </span>
        <input
          type="text"
          name="score"
          onChange={handleChange}
          value={state.input.score}
        />
        <span>sortOrder: </span>
        <input
          type="text"
          name="sortOrder"
          onChange={handleChange}
          value={state.input.sortOrder}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <span>color: </span>
        <input
          type="color"
          name="color"
          onChange={handleChange}
          value={state.input.color}
        />
        <span>relevance: </span>
        <input
          type="text"
          name="relevance"
          onChange={handleChange}
          value={state.input.relevance}
        />
        <span>caption: </span>
        <input
          type="text"
          name="caption"
          onChange={handleChange}
          value={state.input.caption}
        />
      </div>
    </div>
  )
}

const headerChildren = (
  <div>
    <ModalButtonWithForm
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
      mutationDoc={CREATE_QUALITY_ACCESS_SCORE}
      refetchQueries={[{ query: GET_SOURCE_QUALITY_ACCESS_SCORES }]}
      getInputFields={getInputFields}
    />

    {/* <CopyOneOfStringButton
      queryDoc={GET_SOURCE_QUALITY_ACCESS_SCORES}
      dataKey="indications"
    /> */}
  </div>
)

const buttonGroupCallback = ({ name, _id }) => (
  <>
    <ModalButtonWithForm
      modalTitle="Edit Quality of Access Score"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      data={{ input: { name, _id } }}
      // mutationDoc={UPDATE_SOURCE_INDICATION}
      // refetchQueries={[{ query: GET_SOURCE_QUALITY_ACCESS_SCORES }]}
      // getInputFields={getInputFields}
    />

    <DeleteButton
      itemId={_id}
      // mutationDoc={DELETE_SOURCE_INDICATION}
      // refetchQueries={[{ query: GET_SOURCE_QUALITY_ACCESS_SCORES }]}
    />
  </>
)

const panelItemConfig = {
  style: defaultPanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ access, score, relevance, color }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: 200 }}>
        <div style={{ color, fontWeight: 700 }}>{access}</div>
        <div style={{ fontWeight: 300, padding: '12px 0px 0px 0px' }}><em>{relevance}</em></div>
      </div>
      <span style={{ padding: '0 24px', fontSize: 20, color, fontWeight: 700 }}>Score: {score}</span>
    </div>
  )
}

const QualityAccessScorePanel = () => (
  <Panel
    title="Quality of Access Scores"
    headerChildren={headerChildren}
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_QUALITY_ACCESS_SCORES },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default QualityAccessScorePanel
