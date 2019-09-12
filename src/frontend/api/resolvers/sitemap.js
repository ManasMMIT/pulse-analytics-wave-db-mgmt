import {
  GET_SOURCE_TOOLS,
  GET_SELECTED_TOOL,
  GET_TOOL_DASHBOARDS,
  GET_SELECTED_DASHBOARD,
  GET_DASHBOARD_PAGES,
  GET_SELECTED_PAGE,
  GET_PAGE_CARDS,
  GET_SELECTED_CARD,
  GET_STAGED_SITEMAP,
  GET_SOURCE_INDICATIONS,
  GET_SELECTED_INDICATION,
  GET_SELECTED_REGIMENS,
} from '../queries'

import {
  SELECT_DASHBOARD,
  SELECT_PAGE,
  SELECT_CARD,
} from '../mutations'

const sitemapResolvers = {
  selectTool: async (_, { _id: toolId }, { cache, client }) => {
    const { nodes } = cache.readQuery({ query: GET_SOURCE_TOOLS })

    let selectedTool = nodes[0]

    if (toolId) {
      selectedTool = nodes.find(({ _id }) => _id === toolId)
    }

    client.writeQuery({ query: GET_SELECTED_TOOL, data: { selectedTool } })

    await client.mutate({ mutation: SELECT_DASHBOARD })

    return selectedTool
  },
  selectDashboard: async (_, { _id: dashboardId }, { cache, client }) => {
    const { selectedTool: { _id: toolId } } = cache.readQuery({ query: GET_SELECTED_TOOL })

    const { data: { nodes: toolDashboards } } = await client.query({
      query: GET_TOOL_DASHBOARDS,
      variables: { parentId: toolId }
    })

    let selectedDashboard = toolDashboards[0]

    if (dashboardId) {
      selectedDashboard = toolDashboards.find(({ _id }) => _id === dashboardId)
    }

    client.writeQuery({ query: GET_SELECTED_DASHBOARD, data: { selectedDashboard } })

    await client.mutate({ mutation: SELECT_PAGE })

    return selectedDashboard
  },
  selectPage: async (_, { _id: pageId }, { cache, client }) => {
    const { selectedDashboard: { _id: dashboardId } } = cache.readQuery({ query: GET_SELECTED_DASHBOARD })

    const { data: { nodes: dashboardPages } } = await client.query({
      query: GET_DASHBOARD_PAGES,
      variables: { parentId: dashboardId }
    })

    let selectedPage = dashboardPages[0]

    if (pageId) {
      selectedPage = dashboardPages.find(({ _id }) => _id === pageId)
    }

    client.writeQuery({ query: GET_SELECTED_PAGE, data: { selectedPage } })

    try {
      await client.mutate({ mutation: SELECT_CARD })
    } catch (e) {
      console.error('Maybe no page exists for dashboard?')
    }

    return selectedPage
  },
  selectCard: async (_, { _id: cardId }, { cache, client }) => {
    const { selectedPage: { _id: pageId } } = cache.readQuery({ query: GET_SELECTED_PAGE })

    const { data: { nodes: pageCards } } = await client.query({
      query: GET_PAGE_CARDS,
      variables: { parentId: pageId }
    })

    let selectedCard = pageCards[0]

    if (cardId) {
      selectedCard = pageCards.find(({ _id }) => _id === cardId)
    }

    client.writeQuery({ query: GET_SELECTED_CARD, data: { selectedCard } })

    return selectedCard
  },
  setStagedSitemap: async (_, { input: { stagedSitemap } }, { cache, client }) => {
    // 1. Query for selectedTeam (if it's cached, you got it; if it's not, you have bigger problems)
    // 2a. If stagedSitemap is empty, use teamId to get selected team and seed it
    // 2b. If stagedSitemap isn't empty, EDITS ARE IN PROGRESS ON THE SITEMAP (DON'T SEED!)
    // 3. Write staged sitemap to GET_STAGED_SITEMAP (expect listeners to that query to trigger)
    // 4. OPEN QUESTION: HOW DOES THE NODE TOGGLE AND REGIONAL BREAKDOWN TOGGLE FIT IN? (if they don't use React local state)

    const formattedStagedSitemap = {
      ...stagedSitemap,
      __typename: "Sitemap",
      _id: "Sitemap",
    }

    client.writeQuery({
      query: GET_STAGED_SITEMAP,
      data: { stagedSitemap: formattedStagedSitemap },
    })

    return formattedStagedSitemap
  },
  selectIndication: async (_, { _id: indicationId }, { cache, client }) => {
    const response = await client.query({ query: GET_SOURCE_INDICATIONS })
    const indications = response.data.indications

    let selectedIndication = indications[0]

    if (indicationId) {
      selectedIndication = indications.find(({ _id }) => _id === indicationId)
    }

    client.writeQuery({ query: GET_SELECTED_INDICATION, data: { selectedIndication } })

    client.writeQuery({
      query: GET_SELECTED_REGIMENS,
      data: { selectedRegimens: selectedIndication.regimens },
    })

    return selectedIndication
  },
}

export default sitemapResolvers
