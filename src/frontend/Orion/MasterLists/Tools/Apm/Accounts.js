import React from 'react'
// import { Query } from 'react-apollo'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from '../../../../Phoenix/shared/Panel'
import ModalButtonWithForm from '../../../shared/ModalButtonWithForm'
import DeleteButton from '../../../shared/DeleteButton'
// import CopyOneOfStringButton from '../../shared/CopyOneOfStringButton'

// import Spinner from '../../../Phoenix/shared/Spinner'

import {
  UPDATE_APM_ORGANIZATION,
  CREATE_APM_ORGANIZATION,
  DELETE_APM_ORGANIZATION,
} from '../../../../api/mutations'

import {
  GET_APM_ORGANIZATIONS,
} from '../../../../api/queries'

import { Colors } from '../../../../utils/pulseStyles'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create APM Account'

const CREATE_MODAL_TITLE = 'Create New Account'

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
    <>
      <div>
        <span>slug: </span>
        <input
          type="text"
          name="slug"
          onChange={handleChange}
          value={state.input.slug}
        />
      </div>
      <div>
        <span>organization: </span>
        <input
          type="text"
          name="organization"
          onChange={handleChange}
          value={state.input.organization}
        />
      </div>
      <div>
        <span>organizationTiny: </span>
        <input
          type="text"
          name="organizationTiny"
          onChange={handleChange}
          value={state.input.organizationTiny}
        />
      </div>
    </>
  )
}

const headerChildren = (
  <div>
    <ModalButtonWithForm
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
      mutationDoc={CREATE_APM_ORGANIZATION}
      refetchQueries={[{ query: GET_APM_ORGANIZATIONS }]}
      getInputFields={getInputFields}
    />

    {/* <CopyOneOfStringButton
      queryDoc={GET_APM_ORGANIZATIONS}
      dataKey='slug'
    /> */}
  </div>
)

const buttonGroupCallback = entity => (
  <>
    <ModalButtonWithForm
      modalTitle="Edit Alternative Payment Models Account"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      data={{ input: entity }}
      mutationDoc={UPDATE_APM_ORGANIZATION}
      refetchQueries={[{ query: GET_APM_ORGANIZATIONS }]}
      getInputFields={getInputFields}
    />

    <DeleteButton
      itemId={entity._id}
      mutationDoc={DELETE_APM_ORGANIZATION}
      refetchQueries={[{ query: GET_APM_ORGANIZATIONS }]}
    />
  </>
)

const panelItemConfig = {
  style: defaultPanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ organization }) => (
    <div >
      {organization}
    </div>
  )
}

const PathwaysAccounts = () => (
  <Panel
    title="Alternative Payment Models Accounts"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: '#FFF',
      borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_APM_ORGANIZATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default PathwaysAccounts
