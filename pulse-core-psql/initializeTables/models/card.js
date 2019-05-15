/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('card', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true
    },
  });
};
