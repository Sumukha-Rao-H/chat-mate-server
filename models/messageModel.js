module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
  
      senderId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      receiverId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      messageS: {
        type: DataTypes.TEXT,
        allowNull: true, // Allow messages with only media
      },
  
      messageR: {
        type: DataTypes.TEXT,
        allowNull: true, // Allow messages with only media
      },
  
      mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Nullable if message is text-only
      },
  
      mediaType: {
        type: DataTypes.ENUM("image", "video", "document"),
        allowNull: true, // Optional for text-only messages
      },
  
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      timestamps: false,
    });
  
    return Message;
  };
  