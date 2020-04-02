import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from '../../Phoenix/shared/Panel'
import ModalButtonWithForm from '../shared/ModalButtonWithForm'
import DeleteButton from '../shared/DeleteButton'
import CopyOneOfStringButton from '../shared/CopyOneOfStringButton'
import { GET_SOURCE_INDICATIONS } from '../../api/queries'

import {
  CREATE_INDICATION,
  UPDATE_SOURCE_INDICATION,
  DELETE_SOURCE_INDICATION,
} from '../../api/mutations'

import { Colors, Spacing } from '../../utils/pulseStyles'

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
  padding: '8px 24px',
  color: Colors.BLACK,
  fontWeight: 600,
  fontSize: 12,
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
}

const getInputFields = (state, handleChange) => {
  return (
    <div style={{ display: 'block' }}>
      <div
        style={{
          color: Colors.BLACK,
          fontSize: 12,
          fontWeight: 500,
          textTransform: 'capitalize',
          marginBottom: Spacing.SMALL,
        }}
      >
        name:
      </div>
      <input
        type="text"
        name="name"
        onChange={handleChange}
        value={state.input.name}
      />
    </div>
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
      datumKey="name"
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
    headerContainerStyle={{
      background: Colors.WHITE,
      borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_INDICATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default IndicationsPanel
