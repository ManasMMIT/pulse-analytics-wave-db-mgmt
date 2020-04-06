import React from 'react'
import styled from '@emotion/styled'
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

import Color from '../../utils/color'
import Spacing from '../../utils/spacing'
import FontSpace from '../../utils/fontspace'

import { defaultPanelItemStyle } from './styledComponents'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Indication'

const CREATE_MODAL_TITLE = 'Create New Indication'

const buttonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
}

const StyledInput = styled.input({
  background: Color.WHITE,
  width: '100%',
  padding: `${Spacing.S3}`,
  borderRadius: 4,
  ...FontSpace.FS2,
})

const getInputFields = (state, handleChange) => {
  return (
    <div style={{ display: 'block' }}>
      <div
        style={{
          color: Color.BLACK,
          fontSize: 12,
          fontWeight: 500,
          marginBottom: Spacing.S2,
        }}
      >
        Name:
      </div>
      <StyledInput
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
      background: Color.WHITE,
      borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_INDICATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default IndicationsPanel
