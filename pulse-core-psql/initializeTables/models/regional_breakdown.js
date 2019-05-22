const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('regional_breakdown', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
