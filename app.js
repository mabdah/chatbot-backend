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
app.post('/sendMessage', async (req, res) => {
    const { chat_id, text } = req.body;

    // Check for missing fields
    if (!chat_id || !text) {
        return res.status(400).json({
            status: 'error',
            error_message: 'Missing required fields: chat_id or text.'
        });
    }
    try {
        const response = await axios.post(
            SEND_MESSAGE_URL,
            {
                api_key: API_KEY,
                to_number: chat_id,
                content: text
            },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log(`API response status: ${response.status}`);

        if (response.status === 200) {
            console.log(`Message sent successfully to ${chat_id}`);
            return res.status(200).json({
                status: 'success',
            });
        } else {
            console.log(`Failed to send the message. HTTP ${response.status}`);
            return res.status(500).json({
                status: 'error',
                error_message: `Failed to send the message. HTTP ${response.status}`
            });
        }

    } catch (error) {
        console.error('Error sending message:', error);

        return res.status(500).json({
            status: 'error',
            error_message: 'An error occurred while sending the message.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})