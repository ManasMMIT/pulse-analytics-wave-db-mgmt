import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from '../../../../Phoenix/shared/Panel'

import { PathwaysAccountModal } from '../../../shared/AccountModals'

import DeleteButton from '../../../shared/DeleteButton'

import {
  DELETE_PATHWAYS_ORGANIZATION,
} from '../../../../api/mutations'

import {
  GET_PATHWAYS_ORGANIZATIONS,
  GET_PAYER_ORGANIZATIONS,
  GET_PROVIDER_ORGANIZATIONS,
} from '../../../../api/queries'

import { Colors } from '../../../../utils/pulseStyles'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Pathways Account'

const buttonStyle = {
  background: '#234768',
  color: 'white',
  borderRadius: 2,
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
  ':hover': {
    background: transparentize(0.95, Colors.BLACK),
  }
}

const headerChildren = (
  <div>
    <PathwaysAccountModal
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
    />
  </div>
)

const buttonGroupCallback = entity => (
  <>
    <PathwaysAccountModal
      account={entity}
      buttonLabel={editIcon}
      isEditModal
    />

    <DeleteButton
      itemId={entity._id}
      mutationDoc={DELETE_PATHWAYS_ORGANIZATION}
      refetchQueries={[
        { query: GET_PATHWAYS_ORGANIZATIONS },
        { query: GET_PAYER_ORGANIZATIONS },
        { query: GET_PROVIDER_ORGANIZATIONS },
      ]}
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
    title="Pathways Accounts"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: '#FFF',
      borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_PATHWAYS_ORGANIZATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default PathwaysAccounts
