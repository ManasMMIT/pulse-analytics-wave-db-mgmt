const _ = require("lodash");
require("dotenv").load();
const Sequelize = require("sequelize");

const {
  ClientModel,
  ClientRoleModel,
  RoleModel,
  UserRoleModel,
  UserModel,
  NodeModel,
  RoleNodeModel,
  n2nModel,
} = require("./models");

const PSQL_LOADER_URI = process.env.PSQL_LOADER_URI;
const isProductionEnv = PSQL_LOADER_URI.includes("amazonaws");

const sslConfig = isProductionEnv
  ? {
      ssl: true,
      dialectOptions: {
        ssl: { require: true }
      }
    }
  : {};

const sequelize = new Sequelize(PSQL_LOADER_URI, sslConfig);

sequelize
  .authenticate()
  .then(() => {
    console.log(`-----Connected to PostgreSQL at ${PSQL_LOADER_URI}-----`);
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

const Client = sequelize.import("client", ClientModel);
const ClientRole = sequelize.import("clients_roles", ClientRoleModel);
const Role = sequelize.import("role", RoleModel);
const UserRole = sequelize.import("users_roles", UserRoleModel);
const User = sequelize.import("user", UserModel);
const Node = sequelize.import("node", NodeModel);
const RoleNode = sequelize.import("roles_nodes", RoleNodeModel);
const n2n = sequelize.import("n2n", n2nModel);


User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole });

Client.belongsToMany(Role, { through: ClientRole });
Role.belongsToMany(Client, { through: ClientRole });

Role.belongsToMany(Node, { through: RoleNode });
Node.belongsToMany(Role, { through: RoleNode });

Node.belongsToMany(Node, {
  through: n2n,
  foreignKey: "parentId",
  otherKey: "childId",
  as: "children"
});

Node.belongsToMany(Node, {
  through: n2n,
  foreignKey: "childId",
  otherKey: "parentId",
  as: "parents"
});

module.exports = {
  sequelize,
  models: _.reduce(
    sequelize.models,
    (acc, model, key) => {
      const capitalizedKey = _.capitalize(key);
      acc[capitalizedKey] = model;

      return acc;
    },
    {}
  )
};
