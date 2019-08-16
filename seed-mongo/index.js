require("dotenv").load();
const mongoDB = require("mongodb");

const {
  models: {
    Client,
    User,
    Role,
    Node,
  }
} = require("./sequelize");

const seedClients = require('./seeds/seedClients');
const seedRoles = require('./seeds/seedRoles');
const seedUsers = require('./seeds/seedUsers');
const seedNodes = require('./seeds/seedNodes');
const seedUsersSitemaps = require('./seeds/seedUsersSitemaps');

const MongoClient = mongoDB.MongoClient;

const LOADER_URI = process.env.LOADER_URI;

const beginMongoWork = async () => {
  console.log("----------Mongo Connect-----------");

  const dbs = await MongoClient.connect(LOADER_URI).catch(err => {
    console.error(err);
    process.exit();
  });

  console.log("Connected to MongoDB successfully...");

  const pulseCore = dbs.db('pulse-core');
  const pulseDev = dbs.db('pulse-dev');
  const pulseProd = dbs.db('pulse-prod');

  await seedClients(Client, pulseCore);
  await seedRoles(Role, pulseCore, pulseDev);
  await seedUsers(User, pulseCore);
  await seedNodes(Node, pulseCore);

  console.log('DONE SEEDING   **** Pulse-Core ****   ');

  await seedUsersSitemaps(pulseCore, pulseDev, pulseProd);
  console.log('DONE SEEDING   **** Pulse-Dev/Prod ****   ');
  
  dbs.close();
};

beginMongoWork();
