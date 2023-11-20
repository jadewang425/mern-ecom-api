import express from 'express'
import dotenv from "dotenv"
import mongoose from 'mongoose'
import { currentDb } from './config/db.js'

dotenv.config()

const app = express()

mongoose
    .connect(currentDb)
    .then(() => console.log('DB connected!'))
    .catch(err => console.log('DB ERROR =>', err))

app.get('/', (req, res) => {
    res.json({
        data: "Jade JJ",
    })
})

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Ecommerce API listening on port ${port}`)
})

