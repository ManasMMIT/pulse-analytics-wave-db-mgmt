const PAGE_CARD_MAP = {
  1: 'Site Locations',
  2: 'Internal Dispensing',
  3: 'Pathways',
  4: 'Alternative Payment Model Breakdown',
  5: 'Staffing',
  6: 'Clinical Designations',
  7: '3rd Party & Internal Pathways',
  8: 'Valued Data Sources & Education Resources',
  9: 'Portfolio Quality of Access Summary',
  10: 'Quality of Access',
  11: null,
  12: null,
  13: 'Review Timing',
  14: 'FACT-Accredited Treatment Centers',
  15: 'Regional Quality of Access',
  16: 'Regional Quality of Access',
  17: 'Payer Participation in Value-Based Models',
  18: 'Strategic Accounts',
  19: 'PowerPoints & Excel Reports',
  20: 'Account Summary: Dominant Quality of Access',
  21: 'Payer Overview',
  22: 'Implemented Traditional Management',
  23: 'Review Timing',
  24: null
}

const createCards = async (sequelize, Page, shouldSeed) => {
  const Card = await sequelize.import('card', require('./models/card'))
  Card.belongsTo(Page)
  Page.hasMany(Card, { onDelete: 'cascade' })

  if (shouldSeed) {
    await Card.sync({ force: true })

    for (let i = 1; i < 25; i += 1) {
      const currentCard = await Card.create({ name: PAGE_CARD_MAP[i] })
      const currentPage = await Page.findByPk(i);
      await currentPage.addCard(currentCard)
    }
  }

  return Card
}

module.exports = createCards
