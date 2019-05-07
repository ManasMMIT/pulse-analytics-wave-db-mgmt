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

    let providerAndPayerToolContents = []
    for (let i = 1; i < 25; i += 1) {
      providerAndPayerToolContents.push({
        order: 1,
        resourceId: 1,
        contentId: i,
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
      })
    }

    await Permission.bulkCreate(providerAndPayerToolContents)

    // regeneron sanofi senior management
    // {
    //   contentOrder: 1,
    //   resourceId: 2,
    //   contentId: 15,
    //   roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74',
    // }
  }

  return Permission
}

module.exports = createPermissions
