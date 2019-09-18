import React from 'react'
// import { Query } from 'react-apollo'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import Panel from '../../../Phoenix/shared/Panel'
import ModalButtonWithForm from '../../shared/ModalButtonWithForm'
// import DeleteButton from './shared/DeleteButton'
// import CopyOneOfStringButton from '../../shared/CopyOneOfStringButton'
import {
  GET_PROVIDER_ACCOUNTS,
} from '../../../api/queries'
// import Spinner from '../../../Phoenix/shared/Spinner'

// import {

// } from '../../../api/mutations'

// import {
//   GET_PROVIDER_ACCOUNTS,
// } from '../../../api/queries'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

// const CREATE_BUTTON_TXT = 'Create Provider Account'

// const CREATE_MODAL_TITLE = 'Create New Account'

// const buttonStyle = {
//   background: "#234768",
//   color: 'white',
// }

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '17px 20px',
  color: '#0E2539',
  fontWeight: 600,
  fontSize: 12,
  marginTop: 10,
  borderTop: '1px solid rgb(182, 185, 188)',
}

const getInputFields = (state, handleChange) => {
  return <div>no</div>
}

const headerChildren = (
  <div>
    {/* <ModalButtonWithForm
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
      // mutationDoc={CREATE_PROVIDER_ACCOUNTS}
      // refetchQueries={[{ query: GET_PROVIDER_ACCOUNTS }]}
      getInputFields={getInputFields}
    /> */}

    {/* <CopyOneOfStringButton
      queryDoc={GET_PROVIDER_ACCOUNTS}
      dataKey='slug'
    /> */}
  </div>
)

const buttonGroupCallback = entity => (
  <>
    <ModalButtonWithForm
      modalTitle="Edit Provider Account"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      data={{ input: entity }}
      // mutationDoc={UPDATE_PROVIDER_ACCOUNTS}
      // refetchQueries={[{ query: GET_PROVIDER_ACCOUNTS }]}
      getInputFields={getInputFields}
    />

    {/* <DeleteButton
      itemId={_id}
      mutationDoc={DELETE_PROVIDER_ACCOUNTS}
      refetchQueries={[{ query: GET_PROVIDER_ACCOUNTS }]}
    /> */}
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
    queryDocs={{
      fetchAllQueryProps: { query: GET_PROVIDER_ACCOUNTS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default ProviderAccounts
