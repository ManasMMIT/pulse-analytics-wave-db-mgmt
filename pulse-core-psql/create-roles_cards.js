const createRolesCards = async ({
  sequelize,
  Role,
  Card,
  shouldSeed,
}) => {
  const RoleCard = await sequelize.import('roles_cards', require('./models/roles_cards'))

  RoleCard.belongsTo(Card)
  RoleCard.belongsTo(Role)
  Role.hasMany(RoleCard, { onDelete: 'cascade' })
  Card.hasMany(RoleCard, { onDelete: 'cascade' })

  if (shouldSeed) {
    await RoleCard.sync({ force: true })

    const entriesToCreate = []
    for (let i = 1, j = 1; i < 25; i += 1) {
      entriesToCreate.push({
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        cardId: i,
        order: j,
      })
    }

    await RoleCard.bulkCreate(entriesToCreate)
  }

  return RoleCard
}

module.exports = createRolesCards
