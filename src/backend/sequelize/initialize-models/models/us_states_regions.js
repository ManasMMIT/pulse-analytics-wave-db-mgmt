const uuid = require('uuid/v4')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('us_states_regions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
    },
    regionId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'compositeIndex',
    },
  }, {
      tableName: 'us_states_regions'
    });
};
