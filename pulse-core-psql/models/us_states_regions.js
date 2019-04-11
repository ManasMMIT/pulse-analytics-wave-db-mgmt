/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('us_states_regions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    us_state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'us_states_regions'
  });
};
