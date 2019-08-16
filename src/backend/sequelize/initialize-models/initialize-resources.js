const initializeResources = ({ sequelize, RegionalBreakdown }) => {
  const Resource = sequelize.import('resource', require('./models/resource'))

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

  return Resource
}

module.exports = initializeResources
