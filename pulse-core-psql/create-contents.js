const CARD_CONTENT_MAP = {
  1: 'Map',
  2: 'HorizontalBarChartWithChips',
  3: 'HorizontalBarChartWithChips',
  4: 'Top Tabs',
  5: 'PulseSimpleTable',
  6: 'Institutional Designations',
  7: null,
  8: null,
  9: 'Portfolio Quality of Access Summary',
  10: 'Top Tabs',
  11: 'Comparison Filter Bar',
  12: null,
  13: null,
  14: 'Coverage Dropdown',
  15: 'PayerFilterOptionsGroup',
  16: 'PayerFilterOptionsGroup',
  17: null,
  18: null,
  19: null,
  20: 'Product Dropdown',
  21: null,
  22: null,
  23: null,
  24: null,
}

const createContents = async (sequelize, Card, shouldSeed) => {
  const Content = await sequelize.import('content', require('./models/content'))
  Content.belongsTo(Content)
  Content.hasMany(Content, { onDelete: 'cascade' })

  Content.belongsTo(Card)
  Card.hasMany(Content, { onDelete: 'cascade' })

  if (shouldSeed) {
    await Content.sync({ force: true })

    for (let i = 1; i < 25; i += 1) {
      const CurrentContent = await Content.create({ name: CARD_CONTENT_MAP[i] })
      const CurrentCard = await Card.findByPk(i);
      await CurrentCard.addContent(CurrentContent)
    }

    const subcontent = await Content.create({
      name: 'Access Overview',
      component: 'ColorLegend',
    })

    const qoaTopTabsContent = await Content.findByPk(10)
    await qoaTopTabsContent.addContent(subcontent)
  }

  return Content
}

module.exports = createContents
