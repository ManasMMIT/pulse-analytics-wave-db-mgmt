const initializePermissions = ({
  sequelize,
  RoleNode,
  Resource,
}) => {
  const Permission = sequelize.import('permission', require('./models/permission'))

  RoleNode.belongsToMany(
    Resource,
    {
      through: Permission,
      foreignKey: 'role_node_id',
    },
  )

  Resource.belongsToMany(
    RoleNode,
    {
      through: Permission,
      otherKey: 'role_node_id'
    },
  )

  return Permission
}

module.exports = initializePermissions
