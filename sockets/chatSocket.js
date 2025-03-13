const { saveMessage } = require('../controllers/chatController');
const Message = require('../models/messageModel');

module.exports = (io) => {

    io.on("connection", (socket) => {
        //console.log("A user connected:", socket.id);

        // Join a room for a conversation
        socket.on("joinRoom", async ({ senderId, receiverId }) => {
            const roomId = [senderId, receiverId].sort().join("_"); // Unique room ID
            socket.join(roomId);
            //console.log(`${socket.id} joined room: ${roomId}`);

            // Fetch chat history
            try {
                const messages = await Message.findAll({
                    where: { receiverId: roomId },
                    order: [['timestamp', 'ASC']],
                    limit: 50, // Fetch the latest 50 messages
                });

                // Send chat history to the user who joined the room
                socket.emit("chatHistory", messages);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            }
        });

        // Handle sending messages
        socket.on("sendMessage", async ({ senderId, receiverId, messageS, messageR, mediaUrl, mediaType }) => {
            const roomId = [senderId, receiverId].sort().join("_");
            console.log("sendMessage hit");
            // Save the message to the database
            try {
                const newMessage = {
                    senderId,
                    receiverId,
                    messageS,
                    messageR,
                    mediaUrl,
                    mediaType,
                };
                await saveMessage(newMessage);

                const outgoingMessage = {
                    senderId,
                    messageR: messageR || null, // encrypted text, if any
                    mediaUrl: mediaUrl || null, // media URL, if any
                    mediaType: mediaType || null, // media type, if any
                  };

                // Emit the message to all users in the room
                io.to(roomId).emit("receiveMessage", outgoingMessage);
                //console.log(`Message sent in room ${roomId}: ${encryptedMessage}`);
            } catch (error) {
                console.error("Failed to save message:", error);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            //console.log("A user disconnected:", socket.id);
        });
    });
};
