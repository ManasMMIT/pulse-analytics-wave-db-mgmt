const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users_roles', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
  }, {
    tableName: 'users_roles'
  });
};
