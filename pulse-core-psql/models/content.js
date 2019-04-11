/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('content', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
};
