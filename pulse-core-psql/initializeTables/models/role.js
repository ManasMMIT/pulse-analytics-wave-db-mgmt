const Sequelize = require('sequelize')
const uuid = require('uuid/v4')

// roles in auth0 are id'ed by UUID, so this model comports with that
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('role', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: () => uuid(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
  });
};
