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

app.post('/', (req, res) => {
    console.log("hello world");

});
app.post('/sendMessage', (req, res) => {
    const { message } = req.body;
    console.log(message, "received in backend");

    res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
