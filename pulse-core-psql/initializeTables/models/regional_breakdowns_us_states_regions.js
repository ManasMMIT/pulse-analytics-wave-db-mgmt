/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('regional_breakdowns_us_states_regions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  }, {
    tableName: 'regional_breakdowns_us_states_regions'
  });
};
