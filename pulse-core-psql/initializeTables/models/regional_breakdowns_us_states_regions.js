/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('regional_breakdowns_us_states_regions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
