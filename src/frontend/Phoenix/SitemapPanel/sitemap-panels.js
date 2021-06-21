import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

import { ToolsPanelListHeader } from './ToolsPanel'
import { DashboardsPanelListHeader } from './DashboardsPanel'
import { PagesPanelListHeader } from './PagesPanel'
import { CardsPanelListHeader } from './CardsPanel'

const PANEL_STYLE = {
  minHeight: 'auto',
  maxHeight: 'auto',
  height: 'auto',
}

const LIST_WRAPPER_STYLE = {
  borderRight: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  minHeight: '100%',
  maxHeight: '100%',
  height: '100%',
}

const SITEMAP_PANELS = [
  {
    searchParamConfig: {
      searchParam: 'toolId',
      searchParamKey: '_id',
    },
    style: PANEL_STYLE,
    listWrapperStyle: LIST_WRAPPER_STYLE,
    listHeaderConfig: {
      ListHeader: ToolsPanelListHeader,
    },
    listConfig: {},
  },
  {
    searchParamConfig: {
      searchParam: 'dashboardId',
      searchParamKey: '_id',
    },
    style: PANEL_STYLE,
    listWrapperStyle: LIST_WRAPPER_STYLE,
    listHeaderConfig: {
      ListHeader: DashboardsPanelListHeader,
    },
    listConfig: {},
  },
  {
    searchParamConfig: {
      searchParam: 'pageId',
      searchParamKey: '_id',
    },
    style: PANEL_STYLE,
    listWrapperStyle: LIST_WRAPPER_STYLE,
    listHeaderConfig: {
      ListHeader: PagesPanelListHeader,
    },
    listConfig: {},
  },
  {
    searchParamConfig: {
      searchParam: 'cardId',
      searchParamKey: '_id',
    },
    style: PANEL_STYLE,
    listWrapperStyle: LIST_WRAPPER_STYLE,
    listHeaderConfig: {
      ListHeader: CardsPanelListHeader,
    },
    listConfig: {},
  },
]

export default SITEMAP_PANELS
