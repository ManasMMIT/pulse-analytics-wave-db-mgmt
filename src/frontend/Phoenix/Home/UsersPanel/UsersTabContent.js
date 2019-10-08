import React from 'react'
import { Query } from 'react-apollo'

import Panel from '../../shared/Panel'
import CreateButton from './CreateButton'
import UpdateButton from './UpdateButton'
import DeleteButton from './DeleteButton'

import {
  SELECT_USER,
} from '../../../api/mutations'

import {
  GET_TEAM_USERS,
  GET_SELECTED_USER,
  GET_SELECTED_TEAM,
} from '../../../api/queries'

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#838c96',
  borderLeft: '4px solid transparent',
  padding: 24,
}

const activePanelItemStyle = {
  cursor: 'default',
  backgroundColor: '#f8fafb',
  color: '#2a7ad3',
  borderLeft: '4px solid #1f6cc7',
}

// const buttonGroupCallback = user => {
//   if (user.isDefault) return null

//   return (
//     <>
//       <UpdateButton user={user} />
//       <DeleteButton userId={user._id} />
//     </>
//   )
// }

const panelItemConfig = {
  selectEntityMutationDoc: SELECT_USER,
  style: defaultPanelItemStyle,
  activeStyle: activePanelItemStyle,
  // buttonGroupCallback,
  label1Callback: ({ username }) => username,
  // ! Note: inactiveStyle not needed until hover effects differ
  // ! between active and inactive states
  // inactiveStyle: inactivePanelItemStyle,
}

const panelStyle = {
  flex: 4,
  backgroundColor: '#f7f9fa',
  minHeight: 'calc(100vh - 37px)',
  maxHeight: 'calc(100vh - 37px)',
}

// const headerChildren = <CreateButton />

const UsersTab = () => (
  // <Query query={GET_SELECTED_TEAM}>
  //   {
  //     ({ data, loading }) => {
  //       if (loading) return null

  //       const { selectedTeam } = data

  //       return (
          <Panel
            style={panelStyle}
            // title={`Users for ${selectedTeam.description}`}
            // headerChildren={headerChildren}
            queryDocs={{
              fetchAllQueryProps: { query: GET_TEAM_USERS },
              fetchSelectedQueryProps: { query: GET_SELECTED_USER },
            }}
            panelItemConfig={panelItemConfig}
          />
  //       )
  //     }
  //   }
  // </Query>
)

export default UsersTab
