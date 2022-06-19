const index = require('./index')
const OmegleClient = require('omegle-node-fix')

module.exports = class OmegleManager {
    clients = []
    tupleBuffers = []
    firstSender = null
    messageCount = 0
    prevCount = 0

    constructor(lang = null) {
        this.clients.push(new OmegleClient(), new OmegleClient())

        if (lang)
            this.setLanguage(lang)

        this.clients[0].on('gotMessage', (msg) => {
            this.processMessage({ author: 0, content: msg })
            if (msg.toLowerCase() == "m")
            msg = "F"
            this.clients[1].send(msg)
        })

        this.clients[1].on('gotMessage', (msg) => {

            this.processMessage({ author: 1, content: msg })
            if (msg.toLowerCase() == "m")
            msg = "F"
            this.clients[0].send(msg)
        })

        for (const client of this.clients) {
            client.language = lang

            client.on('strangerDisconnected', () => {
                this.reconnect()
            })

            client.connect()
        }

        // this timer checks if a message has been sent in the last minute
        setInterval(() =>
        {
            if (this.messageCount != this.prevCount)
                this.prevCount = this.messageCount
            else
                this.reconnect()
        }, 60000)

    }

    reconnect() {
        this.tupleBuffers = []
        console.log("Reconnecting the clients")
        this.firstSender = null
        for (const client of this.clients) {
            client.connect()
        }
    }

    setLanguage(lang) {
        for (const client of this.clients) {
            client.language = lang
        }
    }

    processMessage(message) {
        if (!this.firstSender)
            this.firstSender = message.author

        if (message.author == this.firstSender) {
            this.tupleBuffers.push([message.content])
        }
        else {
            for (const tuple of this.tupleBuffers) {
                if (tuple.length == 1) {
                    tuple.push(message.content)
                    index.db.insertTuple(tuple[0].toLowerCase(), tuple[1].toLowerCase())
                    break
                }
            }
        }

        this.messageCount++

        console.log(this.tupleBuffers)
    }
}
