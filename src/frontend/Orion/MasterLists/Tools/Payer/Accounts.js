import React from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from '../../../../Phoenix/shared/Panel'

import { PayerAccountModal } from './../../../shared/AccountModals'

import DeleteButton from '../../../shared/DeleteButton'

import {
  DELETE_PAYER_ORGANIZATION,
} from '../../../../api/mutations'

import {
  GET_PAYER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
} from '../../../../api/queries'

import { Colors } from '../../../../utils/pulseStyles'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Payer Account'

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
  ':hover': {
    background: transparentize(0.95, Colors.BLACK),
  }
}

const headerChildren = (
  <div>
    <PayerAccountModal
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
    />
  </div>
)

const buttonGroupCallback = entity => (
  <>
    <PayerAccountModal
      account={entity}
      buttonLabel={editIcon}
      isEditModal
    />

    <DeleteButton
      itemId={entity._id}
      mutationDoc={DELETE_PAYER_ORGANIZATION}
      refetchQueries={[
        { query: GET_PAYER_ORGANIZATIONS },
        { query: GET_PATHWAYS_ORGANIZATIONS },
        { query: GET_APM_ORGANIZATIONS },
      ]}
    />
  </>
)

const panelItemConfig = {
  style: defaultPanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ organization }) => (
    <div>
      {organization}
    </div>
  )
}

const PayerAccounts = () => (
  <Panel
    title="Payer Accounts"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: Colors.WHITE,
      borderBottom: `1px solid ${ transparentize(0.9, Colors.BLACK) }`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_PAYER_ORGANIZATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default PayerAccounts
