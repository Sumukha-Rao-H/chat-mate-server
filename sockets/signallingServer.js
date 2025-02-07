module.exports = (io) => {
  const signalingNamespace = io.of("/signaling");

  signalingNamespace.on("connection", (socket) => {
    console.log(`User connected to signaling namespace: ${socket.id}`);

    socket.on("call-user", ({ callerId, recipientId, isVideoCall, sdp }) => {
      console.log(`Incoming call request from ${callerId} to ${recipientId}`);
      signalingNamespace.to(recipientId).emit("incoming-call", { callerId, isVideoCall, sdp });
    });

    socket.on("accept-call", ({ callerId, recipientId, sdp }) => {
      signalingNamespace.to(callerId).emit("call-accepted", { recipientId, sdp });
    });

    socket.on("ice-candidate", ({ candidate, recipientId }) => {
      signalingNamespace.to(recipientId).emit("ice-candidate", { candidate });
    });

    socket.on("sdp", ({ sdp, recipientId }) => {
      signalingNamespace.to(recipientId).emit("sdp", { sdp });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected from signaling namespace: ${socket.id}`);
    });
  });
};
