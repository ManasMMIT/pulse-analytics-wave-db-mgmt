const initializeNodes = sequelize => {
  const Node = sequelize.import('node', require('./models/node'))
  const n2n = sequelize.import('n2n', require('./models/n2n'))

  Node.belongsToMany(
    Node,
    {
      through: n2n,
      foreignKey: 'parentId',
      otherKey: 'childId',
      as: 'children',
    }
  )

  Node.belongsToMany(
    Node,
    {
      through: n2n,
      foreignKey: 'childId',
      otherKey: 'parentId',
      as: 'parents',
    }
  )

  return Node
}

module.exports = initializeNodes
