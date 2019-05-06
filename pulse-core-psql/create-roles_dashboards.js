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
        roleId: 'admin-nested-role',
        dashboardId: 1,
        dashboardOrder: 2,
      },
      {
        roleId: 'admin-nested-role',
        dashboardId: 2,
        dashboardOrder: 1,
      },
      {
        roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74',
        dashboardId: 1,
        dashboardOrder: 1,
      },
      {
        roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74',
        dashboardId: 2,
        dashboardOrder: 2,
      },
    ])
  }

  return RoleDashboard
}

module.exports = createRolesDashboards
