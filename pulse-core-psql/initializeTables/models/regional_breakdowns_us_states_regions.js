const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('regional_breakdowns_us_states_regions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    regional_breakdown_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
    },
    us_state_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
    },
  }, {
      tableName: 'regional_breakdowns_us_states_regions'
    });
};
