const createPermissions = async ({
  sequelize,
  RoleNode,
  Resource,
  shouldSeed,
}) => {
  const Permission = await sequelize.import('permission', require('./models/permission'))

  RoleNode.belongsToMany(
    Resource,
    {
      through: Permission,
      foreignKey: 'role_node_id',
    },
  )

  Resource.belongsToMany(
    RoleNode,
    {
      through: Permission,
      otherKey: 'role_node_id'
    },
  )

  if (shouldSeed) {
    await Permission.sync({ force: true })

    const adminPermissions = [
      {
        resourceId: '6e1aa22e-0b09-4e99-9878-3501a8b395d7',
        role_node_id: 'fcbc4de6-f030-4b68-b864-de5da5975b23',
      },
    ]

    const demoPermissions = [
      {
        resourceId: '6e1aa22e-0b09-4e99-9878-3501a8b395d7',
        role_node_id: 'a88fcb9d-904c-45b4-a4fe-6f3dbe5f5dc7',
      },
    ]

    const regeneronPermissions = [
      {
        resourceId: '7841e51c-c6ea-495d-af1b-3663a99d4647',
        role_node_id: '88ab6ad4-052e-4ee0-8a63-1612dcc1b1ea',
      },
    ]

    await Permission.bulkCreate([
      ...adminPermissions,
      ...demoPermissions,
      ...regeneronPermissions,
    ])
  }

  return Permission
}

module.exports = createPermissions
