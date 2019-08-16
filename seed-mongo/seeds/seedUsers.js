module.exports = async (User, db) => {
  const users = await User.findAll();

  const newUsers = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(user);
    
    const roles = await user.getRoles()
    const hasRoles = Boolean(roles.length)
    const clients = hasRoles ? await roles[0].getClients() : null
    const client = hasRoles && Boolean(clients.length)
      ? { _id: clients[0].id, name: clients[0].name, description: clients[0].description }
      : null
    const newUser = {
      _id: user.id,
      username: user.username,
      email: user.email,
      client,
      schemaVersion: 'v1.0.0',
    };

    newUsers.push(newUser);
  }

  const collection = db.collection("users");
  await collection.insertMany(newUsers);
};
