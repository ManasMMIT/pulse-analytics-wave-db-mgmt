module.exports = async (Node, db) => {
  const nodes = await Node.findAll();

  const newNodes = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    const parents = await node.getParents({
      limit: 1,
      order: [['createdAt', 'ASC']],
      raw: true,
    })

    const newNode = {
      _id: node.id,
      name: node.name,
      type: node.type,
      componentPath: node.componentPath,
      text: {
        subtitle: node.subtitle,
        caption: node.caption,
      },
      order: node.order,
      parentId: parents.length ? parents[0].id : null,
      schemaVersion: "v1.0.0"
    };

    newNodes.push(newNode);
  }

  const collection = db.collection("nodes");
  await collection.insertMany(newNodes);
};
