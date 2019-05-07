const createResources = async ({ sequelize, shouldSeed }) => {
  const Resource = await sequelize.import('resource', require('./models/resource'))

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
      }
    ])
  }

  return Resource
}

module.exports = createResources
