import React from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from '../../../../Phoenix/shared/Panel'
import { ProviderAccountModalButton } from '../../../shared/AccountModals'
import DeleteButton from '../../../shared/DeleteButton'
import ExportExcelButton from '../../../../components/ExportExcelButton'
import ProviderImportButton from './ProviderImportButton'
import CopyOneOfStringButton from '../../../shared/CopyOneOfStringButton'

import {
  DELETE_PROVIDER_ORGANIZATION,
} from '../../../../api/mutations'

import {
  GET_PROVIDER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
} from '../../../../api/queries'

import Color from '../../../../utils/color'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Provider Account'

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

const headerChildren = data => {
  const exportData = data
    .map(({ __typename, connections, ...datum }) => datum)

  const { name } = JSON.parse(localStorage.getItem('user'))

  return (
    <div>
      <ProviderAccountModalButton
        buttonLabel={CREATE_BUTTON_TXT}
        buttonStyle={buttonStyle}
      />
      <CopyOneOfStringButton
        queryDoc={GET_PROVIDER_ORGANIZATIONS}
        dataKey="providerOrganizations"
        datumKey="slug"
        buttonStyle={{ marginRight: 15 }}
      />
      <ExportExcelButton
        createBackup
        filename={`providers-master-list`}
        isDisabled={!exportData.length}
        data={exportData}
      />
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
      borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_PROVIDER_ORGANIZATIONS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default ProviderAccounts
