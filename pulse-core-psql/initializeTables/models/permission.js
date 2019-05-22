const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('permission', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    resourceId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    },
    role_content_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    }
  });
};
