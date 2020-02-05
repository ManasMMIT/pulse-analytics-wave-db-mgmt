import React from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from '../../../../Phoenix/shared/Panel'
import { ProviderAccountModalButton } from '../../../shared/AccountModals'
import DeleteButton from '../../../shared/DeleteButton'
import ExportExcelButton from '../../../../components/ExportExcelButton'
import ProviderImportButton from './ProviderImportButton'

import {
  DELETE_PROVIDER_ORGANIZATION,
} from '../../../../api/mutations'

import {
  GET_PROVIDER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
} from '../../../../api/queries'

import { Colors } from '../../../../utils/pulseStyles'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Provider Account'

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

const headerChildren = data => {
  const exportData = data
    .map(({ __typename, connections, ...datum }) => datum) 

  const { name } = JSON.parse(localStorage.getItem('user'))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: 24 }}>
        <ProviderAccountModalButton
          buttonLabel={CREATE_BUTTON_TXT}
          buttonStyle={buttonStyle}
        />
        <ExportExcelButton
          createBackup
          filename={`providers-master-list`}
          isDisabled={!exportData.length}
          data={exportData}
        />
      </div>
      { name === 'admin' && <ProviderImportButton /> }
    </div>
  )
} 

const buttonGroupCallback = entity => (
  <>
    <ProviderAccountModalButton
      account={entity}
      buttonLabel={editIcon}
      isEditModal
    />

    <DeleteButton
      itemId={entity._id}
      mutationDoc={DELETE_PROVIDER_ORGANIZATION}
      refetchQueries={[
        { query: GET_PROVIDER_ORGANIZATIONS },
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
    <div >
      {organization}
    </div>
  )
}

const ProviderAccounts = () => (
  <Panel
    title="Provider Accounts"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: '#FFF',
      borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_PROVIDER_ORGANIZATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default ProviderAccounts
