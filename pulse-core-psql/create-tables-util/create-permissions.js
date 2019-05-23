const createPermissions = async ({
  sequelize,
  RoleContent,
  Resource,
  shouldSeed,
}) => {
  const Permission = await sequelize.import('permission', require('./models/permission'))

  RoleContent.belongsToMany(
    Resource,
    {
      through: Permission,
      foreignKey: 'role_content_id',
    },
  )

  Resource.belongsToMany(
    RoleContent,
    {
      through: Permission,
      otherKey: 'role_content_id'
    },
  )

  if (shouldSeed) {
    await Permission.sync({ force: true })

    const adminPermissions = [
      {
        resourceId: 2,
        role_content_id: 15,
      },
    ]

    const regeneronPermissions = [
      {
        resourceId: 1,
        role_content_id: 30,
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
