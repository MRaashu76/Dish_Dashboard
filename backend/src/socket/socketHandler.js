/**
 * Configures Socket.io event handlers.
 * Attach to the io instance from server.js.
 *
 * @param {import("socket.io").Server} io
 */
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} — reason: ${reason}`);
    });

    socket.on("error", (err) => {
      console.error(`⚠️  Socket error on ${socket.id}: ${err.message}`);
    });
  });
};

export default socketHandler;
