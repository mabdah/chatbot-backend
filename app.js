require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Endpoint for serving SSE events to the frontend
app.get('/events', (req, res) => {
    // Set the correct headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Function to keep the connection alive by sending a comment every 15 seconds
    const keepAlive = setInterval(() => {
        res.write(': keep-alive\n\n'); // Send a comment to keep the connection open
    }, 15000);

    // Cleanup when the connection is closed
    req.on('close', () => {
        clearInterval(keepAlive);
        res.end();
    });
});

// Endpoint for receiving the message and sending it via SSE
app.post('/sendMessage', (req, res) => {
    const { message } = req.body;
    console.log(message, "received in backend");

    try {
        // Broadcasting the message to all connected SSE clients
        // Note: Normally, you'd have a way to store clients and send messages to specific ones
        res.write(`data: ${JSON.stringify({ message })}\n\n`);  // Send the message to the client via SSE
        res.json({ success: true });
    } catch (error) {
        console.error("SSE error:", error);
        res.status(500).json({ error: "Failed to send message via SSE" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
