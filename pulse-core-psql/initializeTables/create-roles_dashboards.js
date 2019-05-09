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

    const adminEntriesToCreate = [
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
    ]

    const regeneronEntriesToCreate = [
      {
        roleId: 'c04bfb71-9314-4a51-be72-480c3d7c82cf',
        dashboardId: 2,
        order: 1,
        alias: 'setPayerFirst',
      },
      {
        roleId: 'c04bfb71-9314-4a51-be72-480c3d7c82cf',
        dashboardId: 4,
        order: 1,
        alias: 'Payer Management',
      },
      {
        roleId: 'c04bfb71-9314-4a51-be72-480c3d7c82cf',
        dashboardId: 6,
        order: 2,
        alias: 'Payer Accounts',
      },
    ]

    const lillyAdminEntriesToCreate = [
      {
        roleId: '2a46665f-d4f7-40bf-a239-85f5b0cad344',
        dashboardId: 1,
        order: 1,
        alias: 'Provider Targeted Accounts',
      },
      {
        roleId: '2a46665f-d4f7-40bf-a239-85f5b0cad344',
        dashboardId: 3,
        order: 1,
        alias: 'Provider Management',
      },
      {
        roleId: '2a46665f-d4f7-40bf-a239-85f5b0cad344',
        dashboardId: 5,
        order: 2,
        alias: 'Provider Accounts',
      },
    ]

    await RoleDashboard.bulkCreate([
      ...adminEntriesToCreate,
      ...regeneronEntriesToCreate,
      ...lillyAdminEntriesToCreate,
    ])
  }

  return RoleDashboard
}

module.exports = createRolesDashboards
