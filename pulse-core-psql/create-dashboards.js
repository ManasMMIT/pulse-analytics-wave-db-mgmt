const createDashboards = async sequelize => {
  const Dashboard = await sequelize.import('dashboard', require('./models/dashboard'))
  Dashboard.belongsTo(Dashboard)
  Dashboard.hasMany(Dashboard, { onDelete: 'cascade' })

  await Dashboard.sync({ force: true })

  await Dashboard.bulkCreate([
    { name: 'Provider Targeted Accounts' },
    { name: 'Payer' },
  ])

  const parentDashes = await Dashboard.findAll()
  for (childDash of ['Management', 'Accounts']) {
    for (parentDash of parentDashes) {
      const createdChildDash = await Dashboard.create({ name: childDash })
      await parentDash.addDashboard(createdChildDash)
    }
  }

  return Dashboard
}

module.exports = createDashboards
