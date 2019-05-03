const createPermissions = async ({
  sequelize,
  Role,
  Content,
  Resource,
  shouldSeed,
}) => {
  const Permission = await sequelize.import('permission', require('./models/permission'))

  Permission.belongsTo(Role)
  Permission.belongsTo(Content)
  Permission.belongsTo(Resource)
  Role.hasMany(Permission, { onDelete: 'cascade' })
  Content.hasMany(Permission, { onDelete: 'cascade' })
  Resource.hasMany(Permission, { onDelete: 'cascade' })

  if (shouldSeed) {
    await Permission.sync({ force: true })

    await Permission.bulkCreate([
      {
        contentOrder: 1,
        resourceId: 1,
        contentId: 15,
        roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74'
      },
      {
        contentOrder: 1,
        resourceId: 2,
        contentId: 15,
        roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74'
      }
    ])
  }

  return Permission
}

module.exports = createPermissions
