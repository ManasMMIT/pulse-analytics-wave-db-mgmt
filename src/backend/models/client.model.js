const uuid = require('uuid/v4')

// clients in auth0 are id'ed by UUID, so this model comports with that
// (clients are extracted from the roles layer of auth0's hierarchy)
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('client', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
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
