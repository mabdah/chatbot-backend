require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔹 Global CORS Middleware (Handles Preflight Requests)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");  // Allow requests from any domain
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");  // Allowed HTTP methods
    res.header("Access-Control-Allow-Headers", "Content-Type");  // Allowed headers

    if (req.method === "OPTIONS") {
        return res.status(200).send();  // Respond to preflight requests
    }

    next();
});

const PORT = process.env.PORT || 3000;
const TELERIVET_INCOMING_URL = "https://api.telerivet.com/gateway/PNddded6f1601b45f8/446f0f6b8b/incoming";

// 🔹 Root Route
app.get("/", (req, res) => {
    res.send("Hello, ChatBot Backend is running!");
});

let storedMessage = "";  // Global variable to store messages

// 🔹 POST /send - Forward Message to External API
app.post("/send", async (req, res) => {
    const { textMessage, number } = req.body;
    console.log(number, "this is message");

    let uniqueTestNumber = number || "555" + Math.floor(1000 + Math.random() * 9000);
    let name = "ChatBot Test";

    console.log(`Received uniqueTestNumber: ${uniqueTestNumber}`);

    try {
        // Forward message to Telerivet API
        const response = await axios.post(TELERIVET_INCOMING_URL, {
            name: name,
            from_number: uniqueTestNumber,
            content: textMessage,
        });

        const responseData = JSON.parse(response.config.data);
        return res.json({ success: true, value: { uniqueTestNumber: responseData.from_number, message: responseData.content } });

    } catch (error) {
        console.error("Error forwarding message:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🔹 POST /sendMessage - Store Incoming Message
app.post("/sendMessage", (req, res) => {
    const { message } = req.body;
    console.log(message, "message sent to vercel API");

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    storedMessage = message;  // Store the message globally
    console.log("Message received:", storedMessage);

    try {
        res.json({ success: true, value: storedMessage });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Connection failed" });
    }
});

// 🔹 GET /getMessage - Retrieve Stored Message
app.get("/getMessage", (req, res) => {
    console.log(storedMessage, "storedMessage");

    try {
        if (storedMessage) {
            res.json({ success: true, value: storedMessage });
        } else {
            res.json({ success: false, message: "No messages available" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Connection failed" });
    }
});

// 🔹 Start the Express Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
