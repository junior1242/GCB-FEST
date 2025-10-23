const express = require('express');
const { get } = require('mongoose');

const app = express()


app.use('/', (req, res) => {
    res.send("hello shahid , this is the backend of the project")
})
PORT = 9001


app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})