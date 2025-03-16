const express = require('express');

const app = express()
const PORT = 5000

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/sendMessage', (req, res) => {
    const { to, from, content } = req.body


    if (!to || !content) {
        return res.status(400).json({ success: "true", error: "Missing fields" })
    }


    console.log(req, "this is request")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})