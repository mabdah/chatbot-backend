require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔹 Global CORS Middleware
app.use(cors({
    origin: "*",  // Allow requests from any domain
    methods: ["GET", "POST"],  // Only allow GET and POST methods
    allowedHeaders: ["Content-Type"],  // Allow only Content-Type header
    preflightContinue: false, // Don't manually handle preflight requests
    optionsSuccessStatus: 200,  // Send a successful response for OPTIONS requests
}));

const PORT = process.env.PORT || 3000;
const TELERIVET_INCOMING_URL = "https://api.telerivet.com/gateway/PNddded6f1601b45f8/446f0f6b8b/incoming";

// 🔹 Root Route
app.get("/", (req, res) => {
    res.send("Hello, ChatBot Backend is running!");
});

let storedMessage = {
    content: "",
    url: "",
    image: ""
};  // Global variable to store the message
let storedBotWebId = ""

// 🔹 POST /send - Forward Message to External API
app.post("/send", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

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
    res.header("Access-Control-Allow-Origin", "*");

    const { message, bot_web_id } = req.body;
    console.log(message, bot_web_id, "message sent to vercel API");

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    storedMessage = {
        content: message?.content,
        url: message?.url,
        image: message?.image
    };  // Store the message globally

    storedBotWebId = bot_web_id
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
    res.header("Access-Control-Allow-Origin", "*");

    console.log(storedMessage, "storedMessage");

    try {
        if (storedMessage) {
            res.json({ success: true, value: { message: storedMessage.content, bot_web_id: storedBotWebId, url: storedMessage?.url, image: storedMessage?.image } });
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
