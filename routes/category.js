import express from 'express'
import slugify from 'slugify'

import Category from '../models/category.js'

const router = express.Router()

import { requireToken, isAdmin } from '../helper/auth.js'

// POST / create
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

// PUT / update
router.put('/category/:categoryId', requireToken, isAdmin, async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.categoryId, {
            name: req.body.name,
            slug: slugify(req.body.name)
        }, {
            new: true
        })
        res.json(category)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
})
// DELETE / delete
router.delete('/category/:categoryId', requireToken, isAdmin, async (req, res) => {
    try {
        const removed = await Category.findByIdAndDelete(req.params.categoryId)
        res.json(removed)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
})
// GET / index - show list of categories
router.get('/categories', async (req, res) => {
    try {
        const all = await Category.find({})
        res.json(all)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
})
// GET / show a category
router.get('/category/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({slug: req.params.slug})
        res.json(category)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
})

export default router