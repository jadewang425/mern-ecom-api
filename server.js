import express from 'express'
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.get('/', (req, res) => {
    res.json({
        data: "Jade JJ",
    })
})

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Ecommerce API listening on port ${port}`)
})