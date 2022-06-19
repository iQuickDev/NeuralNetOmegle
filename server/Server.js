const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const index = require('../index')
const app = express()
const port = 42069

app.use(cors({origin: '*'}))
app.use(bodyParser.json())

app.get('/', (req, res) =>
{
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/input', (req, res) =>
{
    let answer = index.net.run(req.body.input)
    console.log(`INPUT: ${req.body.input}`)
    console.log(`OUTPUT: ${answer}`)
    res.send({response: answer}).end()
})

app.listen(port, () =>
{
    console.log(`Listening on port ${port}`)
})
