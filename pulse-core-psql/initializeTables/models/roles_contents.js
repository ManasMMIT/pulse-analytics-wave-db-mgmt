const uuid = require('uuid/v4')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('roles_contents', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
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
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    componentPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
      tableName: 'roles_contents'
    });
};
