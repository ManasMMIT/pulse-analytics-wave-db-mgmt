import React from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from 'frontend/components/Panel'

import { ApmAccountModalButton } from '../../shared/AccountModals'
import DeleteButton from './../../shared/DeleteButton'
import CopyOneOfStringButton from './../../shared/CopyOneOfStringButton'

import {
  DELETE_APM_ORGANIZATION,
} from './../../../api/mutations'

import {
  GET_APM_ORGANIZATIONS,
  GET_PAYER_ORGANIZATIONS,
  GET_PROVIDER_ORGANIZATIONS,
} from './../../../api/queries'

import Color from './../../../utils/color'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create APM Account'

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
  }
}

const headerChildren = (
  <div>
    <ApmAccountModalButton
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
    />

    <CopyOneOfStringButton
      queryDoc={GET_APM_ORGANIZATIONS}
      dataKey="apmOrganizations"
      datumKey="slug"
    />
  </div>
)

const buttonGroupCallback = entity => (
  <>
    <ApmAccountModalButton
      account={entity}
      buttonLabel={editIcon}
      isEditModal
    />

    <DeleteButton
      itemId={entity._id}
      mutationDoc={DELETE_APM_ORGANIZATION}
      refetchQueries={[
        { query: GET_APM_ORGANIZATIONS },
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
    title="Alternative Payment Models Accounts"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: '#FFF',
      borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_APM_ORGANIZATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default PathwaysAccounts
