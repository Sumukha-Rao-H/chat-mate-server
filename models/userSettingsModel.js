// models/userSettings.js
module.exports = (sequelize, DataTypes) => {
    const UserSettings = sequelize.define("UserSettings", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Foreign key reference to the user (adjust type if needed)
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Notifications toggle
      notificationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      // Privacy settings using ENUM
      profileVisibility: {
        type: DataTypes.ENUM("Public", "Friends Only", "Private"),
        defaultValue: "Public",
      },
    }, {
      timestamps: true, // Automatically adds createdAt and updatedAt
      tableName: "UserSettings",
    });
  
    return UserSettings;
  };
  