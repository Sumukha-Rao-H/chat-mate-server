module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
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
        allowNull: true, // Sender's encrypted text message
      },

      messageR: {
        type: DataTypes.TEXT,
        allowNull: true, // Receiver's encrypted text message
      },

      originalFileName: {
        type: DataTypes.STRING,
        allowNull: true, // Original file name (optional)
      },
      
      mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Encrypted media file URL (optional)
      },

      mediaType: {
        type: DataTypes.ENUM("image", "video", "document"),
        allowNull: true, // Optional for text-only messages
      },

      // NEW FIELDS FOR FILE ENCRYPTION
      encryptedAESKeyS: {
        type: DataTypes.TEXT,
        allowNull: true, // AES key encrypted with sender's public key
      },

      encryptedAESKeyR: {
        type: DataTypes.TEXT,
        allowNull: true, // AES key encrypted with receiver's public key
      },

      rawAESKey: {
        type: DataTypes.STRING,
        allowNull: true, // AES key used to encrypt media (base64 or hex encoded)
      },

      iv: {
        type: DataTypes.STRING,
        allowNull: true, // Initialization vector used in AES encryption (base64 or hex encoded)
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );

  return Message;
};
