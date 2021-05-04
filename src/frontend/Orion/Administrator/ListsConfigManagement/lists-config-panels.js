import { ListsPanelListHeader, ListsPanelListItem } from './ListsPanel'

import {
  ListItemsPanelListHeader,
  ListItemsPanelListItem,
} from './ListItemsPanel'

const panelHeight = 'calc(100vh - 40px)'

const LISTS_CONFIG_PANELS = [
  {
    searchParamConfig: {
      searchParam: 'listsConfigId',
      searchParamKey: '_id',
    },
    listWrapperStyle: {
      height: panelHeight,
      minHeight: panelHeight,
      maxHeight: panelHeight,
    },
    listHeaderConfig: {
      ListHeader: ListsPanelListHeader,
    },
    listConfig: {
      ListItem: ListsPanelListItem,
    },
  },
  {
    searchParamConfig: {
      searchParam: 'listItemKey',
      searchParamKey: 'labelKey',
    },
    listWrapperStyle: {
      height: panelHeight,
      minHeight: panelHeight,
      maxHeight: panelHeight,
    },
    listHeaderConfig: {
      ListHeader: ListItemsPanelListHeader,
    },
    listConfig: {
      ListItem: ListItemsPanelListItem,
      placeholder: {
        key: 'newListItem',
        data: {
          labelKey: 'newListItem',
        },
      },
      sortableConfig: {},
    },
  },
]

export default LISTS_CONFIG_PANELS
