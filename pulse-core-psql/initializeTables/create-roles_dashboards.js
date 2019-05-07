const createRolesDashboards = async ({
  sequelize,
  Role,
  Dashboard,
  shouldSeed,
}) => {
  const RoleDashboard = await sequelize.import('roles_dashboards', require('./models/roles_dashboards'))

  RoleDashboard.belongsTo(Dashboard)
  RoleDashboard.belongsTo(Role)
  Role.hasMany(RoleDashboard, { onDelete: 'cascade' })
  Dashboard.hasMany(RoleDashboard, { onDelete: 'cascade' })

  if (shouldSeed) {
    await RoleDashboard.sync({ force: true })

    await RoleDashboard.bulkCreate([
      {
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        dashboardId: 1,
        order: 2,
        alias: 'setProviderSecond',
      },
      {
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        dashboardId: 2,
        order: 1,
        alias: 'setPayerFirst',
      },
      {
        roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74',
        dashboardId: 1,
        order: 1,
        alias: 'setProviderFirst',
      },
      {
        roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74',
        dashboardId: 2,
        order: 2,
        alias: 'setPayerSecond',
      },
      {
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        dashboardId: 3,
        order: 1,
        alias: 'Provider Management',
      },
      {
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        dashboardId: 4,
        order: 1,
        alias: 'Payer Management',
      },
      {
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        dashboardId: 5,
        order: 2,
        alias: 'Provider Accounts',
      },
      {
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        dashboardId: 6,
        order: 2,
        alias: 'Payer Accounts',
      },
    ])
  }

  return RoleDashboard
}

module.exports = createRolesDashboards
