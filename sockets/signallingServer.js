module.exports = (io) => {
  const signalingNamespace = io.of("/signaling");
  const users = new Map(); // Map user UIDs to socket IDs

  signalingNamespace.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("register-user", (user) => {
      if (!user || !user.uid) return;
      users.set(user.uid, socket.id);
      console.log(`User registered: ${user.uid} -> ${socket.id}`);
    });

    socket.on("call-user", ({ callerId, recipientId, isVideoCall, signal }) => {
      const recipientSocketId = users.get(recipientId);
      if (recipientSocketId) {
        signalingNamespace.to(recipientSocketId).emit("incoming-call", {
          callerId,
          isVideoCall,
          signal,
        });
      }
    });

    socket.on("signal", ({ recipientId, signalData, senderId }) => {
      const recipientSocketId = users.get(recipientId);
      if (recipientSocketId) {
        signalingNamespace.to(recipientSocketId).emit("signal", { senderId, signalData });
      }
    });

    socket.on("accept-call", ({ callerId, recipientId,signal }) => {
      const callerSocketId = users.get(callerId);
      if (callerSocketId) {
        signalingNamespace.to(callerSocketId).emit("call-accepted", { recipientId, signal });
      }
    });

    socket.on("reject-call", ({ callerId }) => {
      const callerSocketId = users.get(callerId);
      if (callerSocketId) {
        signalingNamespace.to(callerSocketId).emit("call-rejected");
      }
    });

    socket.on("end-call", ({ callerId, recipientId }) => {
      const callerSocketId = users.get(callerId);
      const recipientSocketId = users.get(recipientId);
      signalingNamespace.to(callerSocketId).emit("call-ended");
      signalingNamespace.to(recipientSocketId).emit("call-ended");
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          break;
        }
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
