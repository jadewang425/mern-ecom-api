'use strict'
import dotenv from "dotenv"

dotenv.config()

const database = {
    development: process.env.MONGODB_URI,
    test: process.env.MONGODB_URI,
}

const localDb = process.env.TESTENV ? database.test : database.development

const currentDb = process.env.MONGODB_URI || localDb

export default currentDb