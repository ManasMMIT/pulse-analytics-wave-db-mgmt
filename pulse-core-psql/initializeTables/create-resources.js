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
        sourceId: 1,
      },
      {
        type: 'regionalBreakdown',
        sourceId: 2,
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
