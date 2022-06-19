const Brain = require('brain.js')
const fs = require('fs')

module.exports = class NeuralNetwork
{
    #net
    
    constructor(config)
    {
        this.#net = new Brain.recurrent.LSTM(config)

        if (fs.existsSync('./network/network.json'))
            this.loadData()
    }

    loadData()
    {
        this.#net.fromJSON(JSON.parse(fs.readFileSync('./network/network.json', "utf-8")))
    }

    train(data)
    {
        let trainingInfo = this.#net.train(data, {
            iterations: 1000,
            log: true,
            logPeriod: 1
        })
        fs.writeFileSync('./network/network.json', JSON.stringify(this.#net.toJSON()), "utf-8")
        return trainingInfo
    }

    run(input)
    {
        return this.#net.run(input)
    }
}