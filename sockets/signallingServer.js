module.exports = (io) => {
    // Create a namespace for signaling
    const signalingNamespace = io.of("/signaling");
  
    signalingNamespace.on("connection", (socket) => {
      console.log(`User connected to signaling namespace: ${socket.id}`);
  
      // Handle call initiation
      socket.on("call-user", ({ callerId, recipientId, isVideoCall }) => {
        console.log(`Call from ${callerId} to ${recipientId}`);
        signalingNamespace.to(recipientId).emit("incoming-call", { callerId, isVideoCall });
      });
  
      // Handle call acceptance
      socket.on("accept-call", ({ callerId, recipientId }) => {
        signalingNamespace.to(callerId).emit("call-accepted", { recipientId });
      });
  
      // Handle ICE candidate exchange
      socket.on("ice-candidate", ({ candidate, recipientId }) => {
        signalingNamespace.to(recipientId).emit("ice-candidate", { candidate });
      });
  
      // Handle SDP offer/answer exchange
      socket.on("sdp", ({ sdp, recipientId }) => {
        signalingNamespace.to(recipientId).emit("sdp", { sdp });
      });
  
      // Handle user disconnection
      socket.on("disconnect", () => {
        console.log(`User disconnected from signaling namespace: ${socket.id}`);
      });
    });
  };
  