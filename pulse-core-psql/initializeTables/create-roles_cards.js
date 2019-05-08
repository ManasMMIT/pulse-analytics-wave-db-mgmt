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

    const adminEntriesToCreate = []
    for (let i = 1, j = 1; i < 25; i += 1) {
      adminEntriesToCreate.push({
        roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
        cardId: i,
        order: j,
      })
    }

    const cardIds = [9, 10, 11, 13, 15, 18, 19, 20, 21, 22, 23, 24]
    const regeneronEntriesToCreate = []
    cardIds.forEach(cardId => {
      regeneronEntriesToCreate.push({
        roleId: 'c04bfb71-9314-4a51-be72-480c3d7c82cf',
        cardId,
        order: 1,
      })
    })

    await RoleCard.bulkCreate([
      ...adminEntriesToCreate,
      ...regeneronEntriesToCreate,
    ])
  }

  return RoleCard
}

module.exports = createRolesCards
