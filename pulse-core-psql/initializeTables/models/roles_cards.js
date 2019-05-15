/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('roles_cards', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    cardId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    },
    roleId: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
      tableName: 'roles_cards'
    });
};
