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
    const { chat_id, text } = req.body
    if (!chat_id || !text) {
        return res.status(400).json({
            status: 'error',
            error_message: 'Missing required fields: chat_id or text.'
        });
    }
    try {
        const response = axios.post(
            SEND_MESSAGE_URL, {
            api_key: API_KEY,
            to_number: chat_id,
            content: text
        },
            { headers: { "Content-Type": "application/json" } }
        )
        if (response.status === 200) {
            return res.status(200).json({
                status: 'success',
                // message_id: response.data.id,
                // sent_at: response.data.created_at
            });
        } else {
            // Handle unexpected API error responses
            return res.status(500).json({
                status: 'error',
                error_message: `Failed to send the message. HTTP ${response.status}`
            });
        }
    } catch (error) {
        console.log('Error sending message', error);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})