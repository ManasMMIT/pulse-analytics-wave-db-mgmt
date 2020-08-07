const _ = require('lodash')

const tools = ['PAYER', 'PATHWAYS', 'APM', 'PROVIDER']
const dashboards = ['MANAGEMENT', 'ACCOUNTS']
const pages = ['SUMMARY', 'REPORTS']
const cards = ['CARD1', 'CARD2']

const NODES_MAP = {}

let i = 1

for (let t = 0; t < tools.length; t++) {
  const tool = tools[t]
  const toolKey = `${tool}_TOOL`

  NODES_MAP[toolKey] = {
    _id: i++,
    name: toolKey,
    type: 'tool',
    parentId: null,
    order: t + 1,
  }

  for (let d = 0; d < dashboards.length; d++) {
    const dashboard = dashboards[d]
    const dashboardKey = `${tool}_${dashboard}_DASHBOARD`

    NODES_MAP[dashboardKey] = {
      _id: i++,
      name: dashboardKey,
      type: 'dashboard',
      parentId: NODES_MAP[toolKey]._id,
      order: d + 1,
    }

    for (let p = 0; p < pages.length; p++) {
      const page = pages[p]
      const pageKey = `${tool}_${dashboard}_${page}_PAGE`

      NODES_MAP[pageKey] = {
        _id: i++,
        name: pageKey,
        type: 'page',
        parentId: NODES_MAP[dashboardKey]._id,
        order: p + 1,
      }

      for (let c = 0; c < cards.length; c++) {
        const card = cards[c]
        const cardKey = `${tool}_${dashboard}_${page}_${card}`

        NODES_MAP[cardKey] = {
          _id: i++,
          name: cardKey,
          type: 'card',
          parentId: NODES_MAP[pageKey]._id,
          order: c + 1,
        }
      }
    }
  }
}

module.exports = _.cloneDeep(NODES_MAP)
