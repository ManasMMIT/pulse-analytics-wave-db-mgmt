const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('c2c', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
  }, {
      tableName: 'c2c'
    });
};
