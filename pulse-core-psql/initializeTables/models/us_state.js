/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('us_state', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    stateLong: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
