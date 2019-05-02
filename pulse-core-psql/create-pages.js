const createPages = async (sequelize, Dashboard, shouldSeed) => {
  const Page = await sequelize.import('page', require('./models/page'))
  Page.belongsTo(Dashboard)
  Dashboard.hasMany(Page, { onDelete: 'cascade' })

  if (shouldSeed) {
    await Page.sync({ force: true })

    const ProviderMgmt = await Dashboard.findByPk(3)
    const ProviderAccts = await Dashboard.findByPk(5)
    const PayerMgmt = await Dashboard.findByPk(4)
    const PayerAccts = await Dashboard.findByPk(6)

    const providerMgmtPages = [
      'Regional Footprint',
      'Internal Pharmacy',
      'Pathways',
      'Alternative Payment Models',
    ]

    for (const pageName of providerMgmtPages) {
      const createdPage = await Page.create({ name: pageName })
      await ProviderMgmt.addPage(createdPage)
    }

    const providerAcctsPages = [
      'Business Model & Capabilities',
      'Clinical Sophistication',
      'Value Based Care',
      'Manufacturer Engagement',
    ]

    for (const pageName of providerAcctsPages) {
      const createdPage = await Page.create({ name: pageName })
      await ProviderAccts.addPage(createdPage)
    }

    const payerMgmtPages = [
      'Summary',
      'Quality of Access',
      'Dupixent Relative Access',
      'Competitive Access',
      'Review Timing',
      'Treatment Centers',
      'Regional Targeting',
      'Regional Targeting',
      'Value Based Models',
      'Strategic Accounts',
      'Reports'
    ]

    for (const pageName of payerMgmtPages) {
      const createdPage = await Page.create({ name: pageName })
      await PayerMgmt.addPage(createdPage)
    }

    const payerAcctsPages = [
      'Summary & Engagement',
      'Overview',
      'Management Capabilities',
      'Review Process',
      'Product Coverage',
    ]

    for (const pageName of payerAcctsPages) {
      const createdPage = await Page.create({ name: pageName })
      await PayerAccts.addPage(createdPage)
    }
  }

  return Page
}

module.exports = createPages
