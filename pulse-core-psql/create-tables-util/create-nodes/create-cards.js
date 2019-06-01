const _ = require('lodash')
const PAGE_CARD_MAP = require('./page-to-card-map')

const providerOverviewCardsData = [
  {
    name: 'Management',
    type: 'card',
    order: 1,
    caption: 'Discover trends across the entire account sample through aggregate views of the site of care mix, pharmacy capabilities, pathways, and alternative payment models.',
  },
  {
    name: 'Accounts',
    type: 'card',
    order: 2,
    caption: 'In-depth account profiles detailing important operational infrastructure, clinical sophistication, cost and economic priorities, as well as key decision makers to engage.',
  },
  {
    name: 'Tutorial',
    type: 'card',
    order: 3,
    caption: 'Walk-through of tool capabilities and functionality across the management and account dashboard views.',
    subtitle: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Lilly+Key+Accounts/Web+Tool+Tutorial+-+Lilly+Key+Accounts+2019.pdf',
  },
]

const createCards = async ({
  Node,
  pages,
  dashboards: { provider_overview },
}) => {
  const cards = {}

  const promisesForCardsCreation = _.map(pages, (page, pageKey) => {
    const cardsDataToPersist = PAGE_CARD_MAP[pageKey]

    if (!cardsDataToPersist) return null

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
