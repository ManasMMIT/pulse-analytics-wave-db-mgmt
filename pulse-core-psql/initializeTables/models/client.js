/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('client', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
  });
};
