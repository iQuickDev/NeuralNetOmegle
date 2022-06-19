const sqlite3 = require('sqlite3').verbose()

module.exports = class Database
{
    #db

    constructor(dbPath)
    {
        this.#db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) =>
        {
            if (err)
            {
                console.error(err.message)
                return
            }
        })

        this.#initDB()
    }

    #initDB()
    {
        this.#db.run('CREATE TABLE IF NOT EXISTS dataset(id INTEGER PRIMARY KEY AUTOINCREMENT, input TEXT NOT NULL, output TEXT NOT NULL)', (err) =>
        {
            if (err)
            {
                console.error(err.message)
                return
            }
        })
    }

    insertTuple(input, output)
    {
        this.#db.run('INSERT INTO dataset(input, output) VALUES (?, ?)', [input, output], (err) =>
        {
            if (err)
            {
                console.error(err.message)
                return
            }
        })
    }

    getDataset(callback)
    {
        return this.#db.all("SELECT * FROM dataset", (err, rows) => { return callback(rows) })
    }

    deleteDataset()
    {
        this.#db.run('DELETE FROM dataset', (err) =>
        {
            if (err)
            {
                console.error(err.message)
                return
            }
        })
    }
}