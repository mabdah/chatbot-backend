const express = require('express');

const app = express()
const PORT = 5000

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/about', (req, res) => {
    res.send('About route 🎉 ')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})