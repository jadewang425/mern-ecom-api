import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import db from './config/db.js'
import authRoutes from './routes/auth.js'
import morgan from 'morgan'

dotenv.config()

const app = express()

mongoose
    .connect(db)
    .then(() => console.log('DB connected!'))
    .catch(err => console.log('DB ERROR =>', err))

app.use(morgan('dev'))
app.use(express.json())

// register routes
app.use('/api', authRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Ecommerce API listening on port ${port}`)
})

