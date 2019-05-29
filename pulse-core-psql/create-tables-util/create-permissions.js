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
        role_node_id: '1693d51d-4101-4b9f-892c-e959f1142650',
      },
    ]

    const regeneronPermissions = [
      {
        resourceId: '7841e51c-c6ea-495d-af1b-3663a99d4647',
        role_node_id: 'c9495c16-1999-4552-b5e7-c517b07d0586',
      },
    ]

    await Permission.bulkCreate([
      ...adminPermissions,
      ...regeneronPermissions,
    ])
  }

  return Permission
}

module.exports = createPermissions
