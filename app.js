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

    // Emit the received message to all WebSocket clients
    socket.emit('message', message); // Emit message to WebSocket server

    try {
        res.json({ success: true });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: JSON.stringify(error) });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
