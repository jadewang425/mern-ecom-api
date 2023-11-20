import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import db from './config/db.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()

mongoose
    .connect(db)
    .then(() => console.log('DB connected!'))
    .catch(err => console.log('DB ERROR =>', err))

// register routes
app.use('/api', authRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Ecommerce API listening on port ${port}`)
})

