/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('permission', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    resourceId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    },
    role_content_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    }
  });
};
