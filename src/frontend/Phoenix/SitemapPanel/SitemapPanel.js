import React from 'react'
import _ from 'lodash'
import { useLocation, useParams } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_TEAMS,
  GET_SOURCE_TOOLS,
  GET_TOOL_DASHBOARDS,
  GET_DASHBOARD_PAGES,
  GET_PAGE_CARDS,
} from 'frontend/api/queries'

import StructuralListPanels from 'frontend/components/StructuralListPanels'

import SITEMAP_PANELS from './sitemap-panels'
import { getToolsPanelListItem } from './ToolsPanel'
import { getDashboardsPanelListItem } from './DashboardsPanel'
import { getPagesPanelListItem } from './PagesPanel'
import { getCardsPanelListItem } from './CardsPanel'

import Header from './Header'

class SitemapPanel extends React.Component {
  constructor(props) {
    super(props)

    const initialState = this.getInitialState()
    this.state = initialState
  }

  getInitialState(props = this.props) {
    const {
      selectedTeam: { sitemap },
    } = props

    const initialState = _.mapValues(sitemap, (arr) => _.keyBy(arr, '_id'))

    return initialState
  }

  handleToggle = ({ type, _id, node }) => {
    const newState = _.merge({}, this.state, { [type]: { [_id]: node } })

    this.setState(newState)
  }

  render() {
    const { selectedTeam } = this.props

    const { tools, dashboards, pages, cards } = this.state

    const ToolsPanelListItem = getToolsPanelListItem(tools, this.handleToggle)
    const DashboardsPanelListItem = getDashboardsPanelListItem(
      dashboards,
      this.handleToggle
    )
    const PagesPanelListItem = getPagesPanelListItem(pages, this.handleToggle)
    const CardsPanelListItem = getCardsPanelListItem(cards, this.handleToggle)
    SITEMAP_PANELS[0].listConfig.ListItem = ToolsPanelListItem
    SITEMAP_PANELS[1].listConfig.ListItem = DashboardsPanelListItem
    SITEMAP_PANELS[2].listConfig.ListItem = PagesPanelListItem
    SITEMAP_PANELS[3].listConfig.ListItem = CardsPanelListItem

    return (
      <div
        style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Header
          teamId={selectedTeam._id}
          clientName={selectedTeam.client.description}
          teamName={selectedTeam.description}
          stagedSitemap={this.state}
        />
        <div style={{ display: 'flex', height: '100%', alignItems: 'stretch' }}>
          <StructuralListPanels
            panels={SITEMAP_PANELS}
            searchParamsAncestry={['userId']}
          />
        </div>
      </div>
    )
  }
}

const SitemapPanelContainer = (props) => {
  const location = useLocation()
  const { clientId, teamId } = useParams()
  const {
    toolId: selectedToolId,
    dashboardId: selectedDashboardId,
    pageId: selectedPageId,
  } = (location.search && queryString.parse(location.search)) || {}

  const { data, loading } = useQuery(GET_TEAMS, { variables: { clientId } })
  const {
    data: toolsData,
    loading: toolsLoading,
    error: toolsError,
  } = useQuery(GET_SOURCE_TOOLS)
  const {
    data: dashboardsData,
    loading: dashboardsLoading,
    error: dashboardsError,
  } = useQuery(GET_TOOL_DASHBOARDS, {
    variables: { parentId: selectedToolId },
  })
  const {
    data: pagesData,
    loading: pagesLoading,
    error: pagesError,
  } = useQuery(GET_DASHBOARD_PAGES, {
    variables: { parentId: selectedDashboardId },
  })
  const {
    data: cardsData,
    loading: cardsLoading,
    error: cardsError,
  } = useQuery(GET_PAGE_CARDS, {
    variables: { parentId: selectedPageId },
  })

  if (loading) return null

  const selectedTeam = data.teams.find(({ _id }) => _id === teamId)

  let tools = []
  const toolsFirstDataKey =
    !toolsLoading && !toolsError && Object.keys(toolsData)[0]
  if (toolsFirstDataKey) {
    tools = toolsData[toolsFirstDataKey]
  }
  SITEMAP_PANELS[0].data = tools
  SITEMAP_PANELS[0].loading = toolsLoading
  SITEMAP_PANELS[0].error = toolsError

  let dashboards = []
  let dashboardsListHeaderTitle = ''
  let dashboardsFirstDataKey = null
  if (selectedToolId) {
    dashboardsFirstDataKey =
      !dashboardsLoading && !dashboardsError && Object.keys(dashboardsData)[0]
    if (dashboardsFirstDataKey) {
      dashboards = dashboardsData[dashboardsFirstDataKey]
    }

    const selectedTool = tools.find(
      ({ _id }) => _id === selectedToolId
    )
    if (selectedTool) {
      dashboardsListHeaderTitle = selectedTool.name
    }
  }
  SITEMAP_PANELS[1].data = dashboards
  SITEMAP_PANELS[1].loading = dashboardsLoading
  SITEMAP_PANELS[1].error = dashboardsError
  SITEMAP_PANELS[1].listHeaderConfig.title = dashboardsListHeaderTitle

  let pages = []
  let pagesListHeaderTitle = ''
  let pagesFirstDataKey = null
  if (selectedDashboardId) {
    pagesFirstDataKey =
      !pagesLoading && !pagesError && Object.keys(pagesData)[0]
    if (pagesFirstDataKey) {
      pages = pagesData[pagesFirstDataKey]
    }

    const selectedDashboard = dashboards.find(
      ({ _id }) => _id === selectedDashboardId
    )
    if (selectedDashboard) {
      pagesListHeaderTitle = selectedDashboard.name
    }
  }
  SITEMAP_PANELS[2].data = pages
  SITEMAP_PANELS[2].loading = pagesLoading
  SITEMAP_PANELS[2].error = pagesError
  SITEMAP_PANELS[2].listHeaderConfig.title = pagesListHeaderTitle

  let cards = []
  let cardsListHeaderTitle = ''
  let cardsFirstDataKey = null
  if (selectedPageId) {
    cardsFirstDataKey =
      !cardsLoading && !cardsError && Object.keys(cardsData)[0]
    if (cardsFirstDataKey) {
      cards = cardsData[cardsFirstDataKey]
    }

    const selectedPage = pages.find(
      ({ _id }) => _id === selectedPageId
    )
    if (selectedPage) {
      cardsListHeaderTitle = selectedPage.name
    }
  }
  SITEMAP_PANELS[3].data = cards
  SITEMAP_PANELS[3].loading = cardsLoading
  SITEMAP_PANELS[3].error = cardsError
  SITEMAP_PANELS[3].listHeaderConfig.title = cardsListHeaderTitle

  return <SitemapPanel selectedTeam={selectedTeam} {...props} />
}

export default SitemapPanelContainer
