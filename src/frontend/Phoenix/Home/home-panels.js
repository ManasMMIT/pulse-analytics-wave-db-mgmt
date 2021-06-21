import Color from 'frontend/utils/color'

import {
  ClientsPanelHeader,
  ClientsPanelListHeader,
  ClientsPanelListItem,
} from './ClientsPanel'

import { TeamsPanelListHeader, TeamsPanelListItem } from './TeamsPanel'

import { UsersPanelListHeader, UsersPanelListItem } from './UsersPanel'

const CLIENTS_PANEL_LIST_HEIGHT = 'calc(100vh - 56px)'

const HOME_PANELS = [
  {
    searchParamConfig: {
      searchParam: 'clientId',
      searchParamKey: '_id',
    },
    style: {
      backgroundColor: Color.TOOL_SIDEBAR,
      maxWidth: 320,
      minWidth: 320,
    },
    listWrapperStyle: {
      backgroundColor: Color.TOOL_SIDEBAR,
      height: CLIENTS_PANEL_LIST_HEIGHT,
      maxHeight: CLIENTS_PANEL_LIST_HEIGHT,
      minHeight: CLIENTS_PANEL_LIST_HEIGHT,
    },
    headerConfig: {
      Header: ClientsPanelHeader,
    },
    listHeaderConfig: {
      ListHeader: ClientsPanelListHeader,
    },
    listConfig: {
      ListItem: ClientsPanelListItem,
    },
  },
  {
    searchParamConfig: {
      searchParam: 'teamId',
      searchParamKey: '_id',
    },
    listWrapperStyle: {
      backgroundColor: '#edf1f5',
    },
    listHeaderConfig: {
      ListHeader: TeamsPanelListHeader,
    },
    listConfig: {
      ListItem: TeamsPanelListItem,
    },
  },
  {
    searchParamConfig: {
      searchParam: 'userId',
      searchParamKey: '_id',
    },
    listWrapperStyle: {
      backgroundColor: '#f7f9fa',
      height: '100vh',
    },
    listHeaderConfig: {
      ListHeader: UsersPanelListHeader,
    },
    listConfig: {
      ListItem: UsersPanelListItem,
    },
  },
]

export default HOME_PANELS
