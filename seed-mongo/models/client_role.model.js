const uuid = require('uuid/v4')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('clients_roles', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
  }, {
      tableName: 'clients_roles'
    });
};
