const initializeRegionalTables = sequelize => {
  const UsState = sequelize.import('us_state', require('./models/us_state'))
  const Region = sequelize.import('region', require('./models/region'))
  const RegionalBreakdown = sequelize.import(
    'regional_breakdown',
    require('./models/regional_breakdown')
  )

  UsState.belongsToMany(Region, { through: 'us_states_regions', otherKey: 'stateId' })
  Region.belongsToMany(UsState, { through: 'us_states_regions' })

  const UsStateRegion = sequelize.import(
    'us_states_regions',
    require('./models/us_states_regions'),
  )

  UsStateRegion.belongsToMany(
    RegionalBreakdown,
    {
      through: 'regional_breakdowns_us_states_regions',
      foreignKey: 'us_state_region_id',
      otherKey: 'regional_breakdown_id',
      as: 'bsr',
    },
  )

  RegionalBreakdown.belongsToMany(
    UsStateRegion,
    {
      through: 'regional_breakdowns_us_states_regions',
      foreignKey: 'regional_breakdown_id',
      otherKey: 'us_state_region_id',
      as: 'bsr',
    },
  )

  const BreakdownStateRegion = sequelize.import(
    'regional_breakdowns_us_states_regions',
    require('./models/regional_breakdowns_us_states_regions'),
  )

  return RegionalBreakdown
}

module.exports = initializeRegionalTables
