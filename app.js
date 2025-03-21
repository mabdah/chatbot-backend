require("dotenv").config();
const express = require("express");
const cors = require("cors");
const io = require("socket.io-client");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const SOCKET_SERVER_URL = 'http://localhost:3001'; // WebSocket server URL

const socket = io(SOCKET_SERVER_URL, {
    cors: {
        origin: "*", // Allow the frontend origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    },
    transports: ['websocket']
});

// Listen for connection errors or timeouts
socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});

socket.on('connect_timeout', () => {
    console.error('Socket connection timeout');
});

socket.on('disconnect', (reason) => {
    console.error(`Socket disconnected: ${reason}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/sendMessage', (req, res) => {
    const { message } = req.body;
    console.log(message, "object78");

    try {

        socket.emit('user-message', message);
        // Emit message to WebSocket server
        res.json({ success: true });

    } catch (error) {
        console.error("WebSocket error:", error);
        res.status(500).json({ error: "WebSocket connection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
