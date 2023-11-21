import express from 'express'
import slugify from 'slugify'

import Category from '../models/category.js'

const router = express.Router()

import { requireToken, isAdmin } from '../helper/auth.js'

// POST / create category
router.post('/category', requireToken, isAdmin, async (req, res) => {
    try {
        const {name} = req.body
        if (!name.trim()) {
            return res.json({error: 'Name is reuquired!'})
        }
        // check if category exists
        const existingCategory = await Category.findOne({name})
        if (existingCategory) {
            return res.json({error: 'Category already exists!'})
        }
        const category = await new Category({ name, slug: slugify(name) }).save()
        res.json(category)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
})

export default router