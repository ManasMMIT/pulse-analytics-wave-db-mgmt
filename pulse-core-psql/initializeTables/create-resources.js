const createResources = async ({
  sequelize,
  RegionalBreakdown,
  shouldSeed
}) => {
  const Resource = await sequelize.import('resource', require('./models/resource'))

  Resource.belongsTo(RegionalBreakdown, { foreignKey: 'sourceId' })
  RegionalBreakdown.hasMany(Resource, { onDelete: 'cascade' })

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
      {
        type: 'treatmentPlans',
        sourceId: 1,
      }
    ])
  }

  return Resource
}

module.exports = createResources
