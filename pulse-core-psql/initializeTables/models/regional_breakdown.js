/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('regional_breakdown', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
