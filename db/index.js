const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

databaseUrl = process.env.DATABASE_URL;

// Create a connection to the database
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
          require: true, // SSL is required for production environments
          rejectUnauthorized: false, // Handle SSL certificates
      } : false, // Disable SSL for local development
  },
  pool: {
      max: 10, // Max number of connections in the pool
      min: 0, // Min number of connections in the pool
      acquire: 30000, // Time (in ms) before a connection is considered as failed
      idle: 10000, // Time (in ms) before a connection is released from the pool
  },
});

// Dynamically load models
const User = require("../models/userModel")(sequelize, DataTypes);
const FriendRequest = require("../models/friendRequestModel")(sequelize, DataTypes);
const Friendship = require("../models/friendshipModel")(sequelize, DataTypes);
const Message = require("../models/messageModel")(sequelize, DataTypes);
const Settings = require("../models/userSettingsModel")(sequelize, DataTypes);


// Define associations
User.hasMany(FriendRequest, { foreignKey: "senderUid", as: "sentRequests" });
User.hasMany(FriendRequest, { foreignKey: "receiverUid", as: "receivedRequests" });
User.belongsToMany(User, {
    through: Friendship,
    foreignKey: "user1Uid",
    otherKey: "user2Uid",
    as: "friends",
});
FriendRequest.belongsTo(User, { foreignKey: "senderUid", as: "sender" });
FriendRequest.belongsTo(User, { foreignKey: "receiverUid", as: "receiver" });

module.exports = { sequelize, User, FriendRequest, Friendship, Message, Settings };
