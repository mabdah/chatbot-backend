require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World");
});

let storedMessage = ""; // Global variable to store the message

app.post("/sendMessage", (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    storedMessage = message; // Store the message
    console.log("Message received:", storedMessage);

    try {
        res.json({ success: true, value: storedMessage });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Connection failed" });
    }
});

app.get("/getMessage", (req, res) => {
    console.log(storedMessage, "storedmessage")
    try {
        res.json({ success: true, value: storedMessage });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Connection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
