module.exports = (io) => {
  const signalingNamespace = io.of("/signaling");

  // Map of user UIDs to socket IDs
  const users = new Map();

  signalingNamespace.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register the user with their UID
    socket.on("register-user", (user) => {
      console.log("Received registration request:", user); // Log the full object

      console.log("Before registering:", Array.from(users.entries()));

      if (!user || !user.uid) {
        // Ensure user object exists
        console.log("Invalid user registration attempt. User:", user);
        return;
      }

      const userId = user.uid;
      users.set(userId, socket.id);

      console.log(`User registered: ${userId} -> ${socket.id}`);
      console.log("After registering:", Array.from(users.entries()));
    });

    socket.on("call-user", ({ callerId, callerName, recipientId, isVideoCall, sdp }) => {
      console.log(`Attempting to call user: ${recipientId}`);
      console.log("Currently registered users:", Array.from(users.entries()));

      const recipientSocketId = users.get(recipientId);
      if (recipientSocketId) {
        console.log(`Calling ${recipientId} at ${recipientSocketId}`);
        signalingNamespace
          .to(recipientSocketId)
          .emit("incoming-call", { callerId, callerName, isVideoCall, sdp });
      } else {
        console.log(`Recipient ${recipientId} is not connected.`);
      }
    });

    socket.on("accept-call", ({ callerId, recipientId, sdp }) => {
      const callerSocketId = users.get(callerId);
      if (callerSocketId) {
        signalingNamespace
          .to(callerSocketId)
          .emit("call-accepted", { recipientId, sdp });
      }
    });

    socket.on("ice-candidate", ({ candidate, recipientId }) => {
      const recipientSocketId = users.get(recipientId);
      if (recipientSocketId) {
        signalingNamespace
          .to(recipientSocketId)
          .emit("ice-candidate", { candidate });
      }
    });

    socket.on("sdp", ({ sdp, recipientId }) => {
      const recipientSocketId = users.get(recipientId);
      if (recipientSocketId) {
        signalingNamespace.to(recipientSocketId).emit("sdp", { sdp });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          console.log(`Removed user ${userId} from active connections.`);
          break;
        }
      }
      console.log(
        "Currently connected users after disconnect:",
        Array.from(users.entries())
      );
    });
  });
  console.log("Currently connected users:", Array.from(users.entries()));
};
