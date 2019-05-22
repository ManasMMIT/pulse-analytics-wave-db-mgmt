const uuid = require('uuid/v4')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('permission', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    resourceId: {
      type: DataTypes.UUID,
      unique: 'compositeIndex',
      allowNull: false,
    },
    role_node_id: {
      type: DataTypes.UUID,
      unique: 'compositeIndex',
      allowNull: false,
    }
  });
};
