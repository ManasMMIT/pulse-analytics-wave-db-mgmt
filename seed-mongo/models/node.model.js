const uuid = require("uuid/v4");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("node", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid()
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true
    },
    componentPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};
