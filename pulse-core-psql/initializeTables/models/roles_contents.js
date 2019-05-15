/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('roles_contents', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    contentId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    },
    roleId: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
      tableName: 'roles_contents'
    });
};
