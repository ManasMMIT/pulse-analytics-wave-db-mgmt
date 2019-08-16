const uuid = require("uuid/v4");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "roles_nodes",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: () => uuid()
      },
      nodeId: {
        type: DataTypes.UUID,
        unique: "compositeIndex",
        allowNull: false
      },
      roleId: {
        type: DataTypes.UUID,
        unique: "compositeIndex",
        allowNull: false
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
        allowNull: true
      }
    },
    {
      tableName: "roles_nodes"
    }
  );
};
