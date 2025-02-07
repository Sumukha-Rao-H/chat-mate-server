const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize, User, FriendRequest, Friendship, Message } = require("./db"); // Import models
const userRoutes = require("./routes/userRoutes");
const http = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://chat-mate-mu.vercel.app","http://localhost:3000"],// Production frontend // Allow requests from your frontend
        methods: ["GET", "POST"],
    },
});

require("./sockets/chatSocket")(io);
require("./sockets/signallingServer")(io);

// User routes
app.use("/api", userRoutes);

// Sync database and start server
sequelize.sync({ force: false }) // Use `force: false` to avoid dropping tables on each restart
    .then(() => {
        console.log("Database connected and models synced!");
        server.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

