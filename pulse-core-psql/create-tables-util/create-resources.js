const createResources = async ({
  sequelize,
  RegionalBreakdown,
  shouldSeed
}) => {
  const Resource = await sequelize.import('resource', require('./models/resource'))

  Resource.belongsTo(
    RegionalBreakdown,
    {
      as: 'regionalBreakdown',
      foreignKey: 'sourceId',
      // scoping doesn't appear possible on belongsTo: https://github.com/sequelize/sequelize/issues/3476
      // scope: { type: 'regionalBreakdown' },
    }
  )

  RegionalBreakdown.hasMany(
    Resource,
    {
      foreignKey: 'sourceId',
      onDelete: 'cascade',
      scope: { type: 'regionalBreakdown' }
    }
  )

  if (shouldSeed) {
    await Resource.sync({ force: true })

    await Resource.bulkCreate([
      {
        type: 'regionalBreakdown',
        sourceId: '4be9cef4-455d-4b41-86e5-7248a2c3d8be',
      },
      {
        type: 'regionalBreakdown',
        sourceId: '7fc26f20-4aa5-4898-a181-f927bbb27ff4',
      },
      // {
      //   type: 'treatmentPlans',
      //   sourceId: 1,
      // },
    ])
  }

  return Resource
}

module.exports = createResources
