import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import Panel from '../Phoenix/shared/Panel'
import ModalButtonWithForm from './shared/ModalButtonWithForm'
import DeleteButton from './shared/DeleteButton'
import CopyOneOfStringButton from './shared/CopyOneOfStringButton'
import { GET_SOURCE_INDICATIONS } from './../api/queries'

import {
  CREATE_INDICATION,
  UPDATE_SOURCE_INDICATION,
  DELETE_SOURCE_INDICATION,
} from '../api/mutations'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Indication'

const CREATE_MODAL_TITLE = 'Create New Indication'

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
  return (
    <>
      <span>name: </span>
      <input
        type="text"
        name="name"
        onChange={handleChange}
        value={state.input.name}
      />
    </>
  )
}

const headerChildren = (
  <div>
    <ModalButtonWithForm
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
      mutationDoc={CREATE_INDICATION}
      refetchQueries={[{ query: GET_SOURCE_INDICATIONS }]}
      getInputFields={getInputFields}
    />

    <CopyOneOfStringButton
      queryDoc={GET_SOURCE_INDICATIONS}
      dataKey="indications"
    />
  </div>
)

const buttonGroupCallback = ({ name, _id }) => (
  <>
    <ModalButtonWithForm
      modalTitle="Edit Indication"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      data={{ input: { name, _id } }}
      mutationDoc={UPDATE_SOURCE_INDICATION}
      refetchQueries={[{ query: GET_SOURCE_INDICATIONS }]}
      getInputFields={getInputFields}
    />

    <DeleteButton
      itemId={_id}
      mutationDoc={DELETE_SOURCE_INDICATION}
      refetchQueries={[{ query: GET_SOURCE_INDICATIONS }]}
    />
  </>
)

const panelItemConfig = {
  style: defaultPanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ name }) => name,
}

const IndicationsPanel = () => (
  <Panel
    title="Indications"
    headerChildren={headerChildren}
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_INDICATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default IndicationsPanel
