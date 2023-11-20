import express from 'express'

import User from '../models/user.js'


const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const user = await new User(req.body).save()
        res.json(user)
    } catch (err) {
        console.log(err)
    }
})

export default router