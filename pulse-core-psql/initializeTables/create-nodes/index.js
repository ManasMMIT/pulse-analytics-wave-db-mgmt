const createSitemaps = require('./create-sitemaps')
const createDashboards = require('./create-dashboards')
const createPages = require('./create-pages')
const createCards = require('./create-cards')

const createNodes = async ({ sequelize, shouldSeed }) => {
  const Node = await sequelize.import('node', require('../models/node'))
  const n2n = await sequelize.import('n2n', require('../models/n2n'))

  Node.belongsToMany(
    Node,
    {
      through: n2n,
      foreignKey: 'parentId',
      otherKey: 'childId',
      as: 'parents',
    }
  )

  Node.belongsToMany(
    Node,
    {
      through: n2n,
      foreignKey: 'childId',
      otherKey: 'parentId',
      as: 'children',
    }
  )

  if (shouldSeed) {
    await Node.sync({ force: true })
    await n2n.sync({ force: true })

    const sitemaps = await createSitemaps(Node)

    const dashboards = await createDashboards({ Node, sitemaps })
    // extract provider_overview dash for adding cards to it directly
    // later (the overview dashes have no pages)
    const { provider_overview } = dashboards

    const pages = await createPages({ Node, dashboards })

    const cards = await createCards({
      Node,
      pages,
      dashboards: { provider_overview }
    })
  }

  return Node
}

module.exports = createNodes

/*
// test code to see if relations work as expected

const middleNode = await Node.create({ name: 'middleNode', type: 'page' })
const parentNode = await Node.create({ name: 'parentNode', type: 'dashboard' })
const childNode = await Node.create({ name: 'childNode', type: 'card' })

debugger
await middleNode.addParent(parentNode)
await middleNode.addChild(childNode)
const parentsTest = await middleNode.getParents()
debugger
const singleParent = parentsTest[0]
const middleNodesTest = await singleParent.getChildren()
debugger

const childrenTest = await middleNode.getChildren()
debugger
const singleChild = childrenTest[0]
const middleNodesTest2 = await singleChild.getParents()
debugger
*/
