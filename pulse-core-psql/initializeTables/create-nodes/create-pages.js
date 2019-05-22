const _ = require('lodash')

const createPages = async ({
  Content,
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

  for (const pageName of providerMgmtPages) {
    const createdPage = await Content.create({ name: pageName, type: 'page' })
    pages[`provider_management_${_.camelCase(pageName)}`] = createdPage
    await provider_management.addChild(createdPage)
  }

  const providerAcctsPages = [
    'Business Model & Capabilities',
    'Clinical Sophistication',
    'Value Based Care',
    'Manufacturer Engagement',
  ]

  for (const pageName of providerAcctsPages) {
    const createdPage = await Content.create({ name: pageName, type: 'page' })
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

  for (const pageName of payerMgmtPages) {
    const createdPage = await Content.create({ name: pageName, type: 'page' })
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

  for (const pageName of payerAcctsPages) {
    const createdPage = await Content.create({ name: pageName, type: 'page' })
    pages[`payer_accounts_${_.camelCase(pageName)}`] = createdPage
    await payer_accounts.addChild(createdPage)
  }

  return pages
}

module.exports = createPages
