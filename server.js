const express = require('express')
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')
require('dotenv').config()

const PORT = 3000
const app = express()



app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors())

let db
// const connectionString = process.env.DB_STRING
const connectionString = 'mongodb+srv://mdong:metaknight@cluster0.7ffxd.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'second-june-test'

MongoClient.connect(connectionString)
    .then(client => {
        console.log('con to db')
        db = client.db(dbName)
        const quotesCollection = db.collection('quotes')

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', {quotes : results})
                })
                .catch(error => console.error(error))

        })
        
        app.post('/new', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then( result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(err => console.error(err))
        })
        
        app.put('/toggleIt', (req, res) => {
            console.log(req.body)
            quotesCollection.updateOne(
                {
                    one:req.body.matchOne,
                    second:req.body.matchSecond,
                }
                ,{$set: {
                    one: req.body.one,
                    second: req.body.second
                    }
                }
            )
            .then(result => {
                console.log('server toggle')
                // console.log(result)
                res.json('case toggled')
            })
            .catch(err => console.error(err))
        })

        app.delete('/del', (req, res) => {
            quotesCollection.deleteOne(
                {
                    one: req.body.one,
                    second: req.body.second
                }
            )
            .then(() => {
                console.log('server deleted')
                res.json('client deleted')
            })
            .catch(err => console.log(err))
        })


    })
    .catch(err => console.error(err))

app.listen(process.env.PORT ||PORT, () => {
    console.log(`listening on port ${PORT}`)
})

