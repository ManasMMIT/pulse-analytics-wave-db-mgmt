const _ = require('lodash')
const PAGE_CARD_MAP = require('./page-to-card-map')

const providerOverviewCardsData = [
  {
    name: 'Management',
    type: 'card',
  },
  {
    name: 'Accounts',
    type: 'card',
  },
  {
    name: 'Tutorial',
    type: 'card',
  },
]

const createCards = async ({
  Node,
  pages,
  dashboards: { provider_overview },
}) => {
  const cards = {}

  const promisesForCardsCreation = _.map(pages, (page, pageKey) => {
    const cardEntry = PAGE_CARD_MAP[pageKey]

    if (!cardEntry) return null

    const cardsDataToPersist = cardEntry.map(({ name }) => ({
      name,
      type: 'card',
    }))

    return Node.bulkCreate(cardsDataToPersist).then(createdCards => {
      createdCards.forEach(createdCard => {
        cards[`${pageKey}_${_.camelCase(createdCard.name)}`] = createdCard
      })

      return page.addChildren(createdCards)
    })
  })

  promisesForCardsCreation.push(
    Node.bulkCreate(providerOverviewCardsData).then(createdCards => {
      createdCards.forEach(createdCard => {
        cards[`provider_overview_${createdCard.name.toLowerCase()}Card`] = createdCard
      })

      return provider_overview.addChildren(createdCards)
    })
  )

  await Promise.all(promisesForCardsCreation)

  return cards
}

module.exports = createCards
