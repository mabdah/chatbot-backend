require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// CORS Configuration
const corsOptions = {
    origin: '*',  // Allow requests from any origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// Store connected SSE clients
let clients = [];

// ✅ SSE Events Endpoint
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add client to the list
    clients.push(res);

    // Keep connection alive
    const keepAlive = setInterval(() => {
        res.write(': keep-alive\n\n');
    }, 15000);

    // Cleanup when connection closes
    req.on('close', () => {
        clearInterval(keepAlive);
        clients = clients.filter(client => client !== res);
        res.end();
    });
});

app.post('/sendMessage', (req, res) => {
    const { message } = req.body;
    console.log(message, "received in backend");

    // Broadcast message to all connected SSE clients
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify({ message })}\n\n`);
    });

    res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
