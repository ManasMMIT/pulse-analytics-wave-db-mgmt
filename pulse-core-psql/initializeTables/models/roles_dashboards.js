/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('roles_dashboards', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dashboardId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    },
    roleId: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
      tableName: 'roles_dashboards'
    });
};
