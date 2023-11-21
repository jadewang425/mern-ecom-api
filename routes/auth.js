import express from 'express'
import User from '../models/user.js'
import { hashPassword, comparePassword } from '../helper/auth.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


const router = express.Router()

// POST / register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        // if no name, email, or password
        if (!name.trim()) {
            return res.json({error: 'Name is required'})
        }
        if (!email) {
            return res.json({error: 'Email is required'})
        }
        if (!password || password.length < 6) {
            return res.json({error: "Password is required and must be at least 6 characters long"})
        }
        // check if email already registered
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.json({ error: "Email is taken"})
        }
        // hash password and save user
        const hashedPassword = await hashPassword(password)
        const user = await new User({name, email, password: hashedPassword}).save()
        // create signed jwt
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
        // send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token
        })
    } catch (err) {
        console.log(err)
    }
})

export default router