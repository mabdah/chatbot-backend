// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const socketIoClient = require("socket.io-client");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const SOCKET_SERVER_URL = 'http://localhost:3001'; // WebSocket server URL

const socket = socketIoClient(SOCKET_SERVER_URL);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/sendMessage', (req, res) => {
    const { message } = req.body;
    console.log(message, "object78");

    if (socket.connected) {
        socket.emit('message', message); // Emit message to WebSocket server
        res.json({ success: true });
    } else {
        console.error("WebSocket not connected");
        res.status(500).json({ error: "WebSocket connection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
