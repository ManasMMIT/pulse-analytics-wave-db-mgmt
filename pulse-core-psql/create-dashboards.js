const createDashboards = async (sequelize, shouldSeed) => {
  const Dashboard = await sequelize.import('dashboard', require('./models/dashboard'))
  Dashboard.belongsTo(Dashboard)
  Dashboard.hasMany(Dashboard, { onDelete: 'cascade', as: 'ChildDashboard' })

  if (shouldSeed) {
    await Dashboard.sync({ force: true })

    await Dashboard.bulkCreate([
      { name: 'Provider Targeted Accounts' },
      { name: 'Payer' },
    ])

    const parentDashes = await Dashboard.findAll()
    for (const childDash of ['Management', 'Accounts']) {
      for (const parentDash of parentDashes) {
        const createdChildDash = await Dashboard.create({ name: childDash })
        debugger
        await parentDash.addChildDashboard(createdChildDash)
      }
    }
  }

  return Dashboard
}

module.exports = createDashboards
