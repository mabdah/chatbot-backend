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
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    },
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log('Connected to the WebSocket server');
});

socket.on('message', (message) => {
    console.log('Message received on the client:', message);  // Log the message
});

socket.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/sendMessage', (req, res) => {
    const { message } = req.body;
    console.log("Received message in POST route:", message); // Log the message

    try {
        socket.emit('user-message', message); // Emit the message to the WebSocket server
        console.log("Message emitted to WebSocket server");

        res.json({ success: true });

    } catch (error) {
        console.error("WebSocket error:", error);
        res.status(500).json({ error: "WebSocket connection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
