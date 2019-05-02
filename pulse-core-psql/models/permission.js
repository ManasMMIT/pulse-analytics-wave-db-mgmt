/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('permission', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    contentOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contentId: {
      unique: 'compositeIndex',
      allowNull: false,
    },
    resourceId: {
      unique: 'compositeIndex',
      allowNull: false,
    },
    roleId: {
      unique: 'compositeIndex',
      allowNull: false,
    },
  });
};
