const createRolesContents = async ({
  sequelize,
  Role,
  Content,
  shouldSeed,
}) => {
  const RoleContent = await sequelize.import('roles_contents', require('./models/roles_contents'))

  Role.belongsToMany(Content, { through: RoleContent })
  Content.belongsToMany(Role, { through: RoleContent })

  /*
    The hasMany below seems redundant after the above associations but to get
    from roles to resources, we have to be able to join roles to roles_contents,
    and then roles_contents to resources (through the permissions table); otherwise,
    sequelize #includes errors, saying there's no association between roles and roles_contents.

    I didn't specify a cascade deletion in the hasMany below because
    the previous many-to-many association should take care of the cascade deletion.
    See: http://docs.sequelizejs.com/manual/associations.html#belongs-to-many-associations:
    "if you delete or update a row from one side of an n:m association, all the rows
    in the join table referencing that row will also be deleted or updated"

    Tested this on 5/10/19 and seemed to work without adding { onDelete: 'cascade }
  */
  Role.hasMany(RoleContent)

  if (shouldSeed) {
    await RoleContent.sync({ force: true })

    const adminEntries = []
    for (let i = 1; i < 26; i += 1) {
      adminEntries.push({
        order: 1,
        contentId: i,
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
      })
    }

    const regeneronContentIds = [9, 10, 11, 13, 15, 18, 19, 20, 21, 22, 23, 24]
    const regeneronEntries = regeneronContentIds.map(contentId => ({
      order: 1,
      contentId,
      roleId: 'c04bfb71-9314-4a51-be72-480c3d7c82cf',
    }))

    const lillyAdminContentIds = [1, 2, 3, 4, 5, 6, 7, 8]
    const lillyEntries = lillyAdminContentIds.map(contentId => ({
      order: 1,
      contentId,
      roleId: '2a46665f-d4f7-40bf-a239-85f5b0cad344',
    }))

    await RoleContent.bulkCreate([
      ...adminEntries,
      ...regeneronEntries,
      ...lillyEntries,
    ])
  }

  return RoleContent
}

module.exports = createRolesContents
0
