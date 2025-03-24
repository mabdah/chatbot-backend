require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",  // Allow requests from any origin
    methods: ["GET", "POST", "OPTIONS"],  // Allowed HTTP methods
    allowedHeaders: ["Content-Type"],  // Allowed headers
}));

const PORT = process.env.PORT || 3000;
const TELERIVET_INCOMING_URL = "https://api.telerivet.com/gateway/PNddded6f1601b45f8/446f0f6b8b/incoming";
app.get("/", (req, res) => {
    res.send("Hello World");
});

let storedMessage = ""; // Global variable to store the message
app.post("/send", async (req, res) => {
    const { textMessage, number } = req.body;
    const uniqueTestNumber = number || "555" + Math.floor(1000 + Math.random() * 9000);
    const name = "ChatBot test";
    try {
        // Forward message to Telerivet
        const response = await axios.post(TELERIVET_INCOMING_URL, {
            name: name,
            from_number: uniqueTestNumber,
            content: textMessage,
        });
        const responseData = JSON.parse(response.config.data)
        return res.json({ success: true, value: { uniqueTestNumber: responseData.from_number, message: responseData.content } });

    } catch (error) {
        console.error("Error forwarding message:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post("/sendMessage", (req, res) => {
    const { message } = req.body;
    console.log(message, "message sent to vercel api")
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    storedMessage = message; // Store the message
    console.log("Message received:", storedMessage);

    // try {
    //     res.json({ success: true, value: storedMessage });
    // } catch (error) {
    //     console.error("Error:", error);
    //     res.status(500).json({ error: "Connection failed" });
    // }
});

app.get("/getMessage", (req, res) => {
    console.log(storedMessage, "storedmessage")
    try {
        if (storedMessage) {
            res.json({ success: true, value: storedMessage });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Connection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
