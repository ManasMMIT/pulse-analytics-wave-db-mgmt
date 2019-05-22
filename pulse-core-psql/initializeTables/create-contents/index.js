const createDashboards = require('./create-dashboards')
const createPages = require('./create-pages')
const createCards = require('./create-cards')

const createContents = async ({ sequelize, shouldSeed }) => {
  const Content = await sequelize.import('content', require('../models/content'))
  const c2c = await sequelize.import('c2c', require('../models/c2c'))

  Content.belongsToMany(
    Content,
    {
      through: c2c,
      foreignKey: 'parentId',
      otherKey: 'childId',
      as: 'parents',
    }
  )

  Content.belongsToMany(
    Content,
    {
      through: c2c,
      foreignKey: 'childId',
      otherKey: 'parentId',
      as: 'children',
    }
  )

  if (shouldSeed) {
    await Content.sync({ force: true })
    await c2c.sync({ force: true })

    const dashboards = await createDashboards(Content)
    // extract provider_overview dash for adding cards to it directly
    // later (the overview dashes have no pages)
    const { provider_overview } = dashboards

    const pages = await createPages({ Content, dashboards })

    const cards = await createCards({
      Content,
      pages,
      dashboards: { provider_overview }
    })


  }

  return Content
}

module.exports = createContents

/*
// test code to see if relations work as expected

const middleNode = await Content.create({ name: 'middleNode', type: 'page' })
const parentNode = await Content.create({ name: 'parentNode', type: 'dashboard' })
const childNode = await Content.create({ name: 'childNode', type: 'card' })

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
