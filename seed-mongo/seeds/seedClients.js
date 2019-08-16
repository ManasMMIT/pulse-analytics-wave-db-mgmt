module.exports = async (Client, db) => {
  const clients = await Client.findAll({ raw: true })
    .map(({ id, name, description }) => ({
      _id: id,
      name,
      description,
      schemaVersion: 'v1.0.0',
    }))

  const collection = db.collection("clients");
  await collection.insertMany(clients);
}
