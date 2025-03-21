require("dotenv").config();
const express = require("express");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/sendMessage', (req, res) => {
    const { message } = req.body;
    console.log(message, "object78");

    try {
        res.json({ success: true, value: message });

    } catch (error) {
        console.error(" error:", error);
        res.status(500).json({ error: "connection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
