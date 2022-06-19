const Omegle = require('./OmegleManager')
const NeuralNetwork = require('./network/NeuralNetwork')
const Database = require('./database/DatabaseManager')
const Server = require('./server/Server')
const db = new Database('./database/data.db')
const net = new NeuralNetwork({
    hiddenLayers: [10, 10],
    learningRate: 0.1,
    activation: 'leaky-relu',
    errorThreshhold: 0.005,
    iterations: 100,
})

//const omegle = new Omegle('it')

db.getDataset((rows) => {

    let serializedData = []

    for (const row of rows) {
        serializedData.push({
            input: [row.input],
            output: [row.output]
        })
    }

    console.log(net.train(serializedData))
})

exports.db = db
exports.net = net