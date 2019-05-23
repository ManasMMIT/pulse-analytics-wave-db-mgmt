const _ = require('lodash')

const createPages = async ({
  Node,
  dashboards: {
    provider_management,
    provider_accounts,
    payer_management,
    payer_accounts,
  },
}) => {
  const pages = {}

  const providerMgmtPages = [
    'Regional Footprint',
    'Internal Pharmacy',
    'Pathways',
    'Alternative Payment Models',
  ]

  let i = 0
  for (const pageName of providerMgmtPages) {
    const createdPage = await Node.create({
      name: pageName,
      type: 'page',
      order: ++i,
    })
    pages[`provider_management_${_.camelCase(pageName)}`] = createdPage
    await provider_management.addChild(createdPage)
  }

  const providerAcctsPages = [
    'Business Model & Capabilities',
    'Clinical Sophistication',
    'Value Based Care',
    'Manufacturer Engagement',
  ]

  let j = 0
  for (const pageName of providerAcctsPages) {
    const createdPage = await Node.create({
      name: pageName,
      type: 'page',
      order: ++j,
    })
    pages[`provider_accounts_${_.camelCase(pageName)}`] = createdPage
    await provider_accounts.addChild(createdPage)
  }

  const payerMgmtPages = [
    'Summary',
    'Quality of Access',
    'Dupixent Relative Access',
    'Competitive Access',
    'Review Timing',
    'Treatment Centers',
    'Regional Targeting',
    'Value Based Models',
    'Strategic Accounts',
    'Reports'
  ]

  let k = 0
  for (const pageName of payerMgmtPages) {
    const createdPage = await Node.create({
      name: pageName,
      type: 'page',
      order: ++k,
    })
    pages[`payer_management_${_.camelCase(pageName)}`] = createdPage
    await payer_management.addChild(createdPage)
  }

  const payerAcctsPages = [
    'Summary & Engagement',
    'Overview',
    'Management Capabilities',
    'Review Process',
    'Product Coverage',
  ]

  let l = 0
  for (const pageName of payerAcctsPages) {
    const createdPage = await Node.create({
      name: pageName,
      type: 'page',
      order: ++l,
    })
    pages[`payer_accounts_${_.camelCase(pageName)}`] = createdPage
    await payer_accounts.addChild(createdPage)
  }

  return pages
}

module.exports = createPages
