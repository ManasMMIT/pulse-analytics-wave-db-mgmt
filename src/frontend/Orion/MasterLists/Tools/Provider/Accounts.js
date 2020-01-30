import React from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from '../../../../Phoenix/shared/Panel'
import { ProviderAccountModal } from '../../../shared/AccountModals'
import DeleteButton from '../../../shared/DeleteButton'
import DownloadCsvButton from './../../../../components/DownloadCsvButton'
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
  margin: '0px 12px',
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
  const csvData = data
    .map(({ __typename, connections, ...datum }) => datum)

  if (csvData.length) csvData.splice(0, 0, {}, {})

  return (
    <div style={{ display: 'flex' }}>
      <ProviderAccountModal
        buttonLabel={CREATE_BUTTON_TXT}
        buttonStyle={buttonStyle}
      />
      <DownloadCsvButton
        createBackup
        filename={`providers-master-list`}
        isDisabled={!csvData.length}
        data={csvData}
      />
      <ProviderImportButton />
    </div>
  )
} 

const buttonGroupCallback = entity => (
  <>
    <ProviderAccountModal
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
