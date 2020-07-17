import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import Panel from '../../../components/Panel'
import { PayerAccountModalButton } from './../../shared/AccountModals'
import DeleteButton from './../../shared/DeleteButton'
import CopyOneOfStringButton from './../../shared/CopyOneOfStringButton'

import { DELETE_PAYER_ORGANIZATION } from './../../../api/mutations'

import {
  GET_PAYER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
  GET_VIEW_OBM_PAYER_PARTNERSHIPS,
} from './../../../api/queries'

import Color from './../../../utils/color'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Payer Account'

const buttonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
}

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 24px',
  color: Color.BLACK,
  fontWeight: 600,
  fontSize: 12,
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  ':hover': {
    background: transparentize(0.95, Color.BLACK),
  },
}

const headerChildren = (
  <div>
    <PayerAccountModalButton
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
    />

    <CopyOneOfStringButton
      queryDoc={GET_PAYER_ORGANIZATIONS}
      dataKey="payerOrganizations"
      datumKey="slug"
    />
  </div>
)

const buttonGroupCallback = (entity) => (
  <>
    <PayerAccountModalButton
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
        { query: GET_VIEW_OBM_PAYER_PARTNERSHIPS },
      ]}
    />
  </>
)

const panelItemConfig = {
  style: defaultPanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ organization }) => <div>{organization}</div>,
}

const PayerAccounts = () => (
  <Panel
    title="Payer Accounts"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: Color.WHITE,
      borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_PAYER_ORGANIZATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default PayerAccounts
