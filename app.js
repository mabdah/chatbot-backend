require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000
const API_BASE_URL = process.env.API_BASE_URL;
const PROJECT_ID = process.env.PROJECT_ID;
const API_KEY = process.env.API_KEY;
const SEND_MESSAGE_URL = `${API_BASE_URL}/projects/${PROJECT_ID}/messages/send`
app.get('/', (req, res) => {
    res.send('Hello World')
})
app.post('/sendMessage', (req, res) => {
    const { message, } = req.body;
    console.log(message, "object78")
    try {
        res.json({ success: true, })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: JSON.stringify(error) });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})