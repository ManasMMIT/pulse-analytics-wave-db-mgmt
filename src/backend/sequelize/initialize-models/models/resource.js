const uuid = require('uuid/v4')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('resource', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sourceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });
};
