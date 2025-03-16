const express = require('express');

const app = express()
const PORT = 5000

app.get('/', (req, res) => {
    res.send('Hello World')
})
let chatMessages = [];
app.post('/sendMessage', (req, res) => {
    const { to, from, content } = req.body


    if (!to || !content) {
        return res.status(400).json({ success: "true", error: "Missing fields" })
    }

    chatMessages.push({ to, from, content, timestamp: new Date() });

    console.log("Message received and stored:", { to, from, content });

    res.json({ success: true, message: "Message delivered to user" });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})