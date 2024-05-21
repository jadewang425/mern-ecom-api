import express from 'express'
import User from '../models/user.js'
import { hashPassword, comparePassword } from '../helper/auth.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { requireToken, isAdmin } from '../helper/auth.js'

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

// POST / user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        // if no name, email, or password
        if (!email) {
            return res.json({error: 'Email is required'})
        }
        if (!password || password.length < 6) {
            return res.json({error: "Password is required and must be at least 6 characters long"})
        }
        // check if email already registered
        const user = await User.findOne({email})
        if (!user) {
            return res.json({ error: "User not found"})
        }
        // hash password and save user
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.json({error: "Wrong password"})
        }
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
            token,
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/auth-check', requireToken, (req, res) => {
    res.json({ok: true})
})
router.get('/admin-check', requireToken, isAdmin, (req, res) => {
    res.json({ok: true})
})

// testing requireToken
router.get('/secret', requireToken, isAdmin, (req, res) => {
    res.json({currentUser: req.user})
})

export default router