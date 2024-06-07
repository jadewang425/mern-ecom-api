import express from 'express'
import slugify from 'slugify'
import formidable from 'express-formidable'
import fs from 'fs'

import Product from '../models/product.js'

const router = express.Router()

import { requireToken, isAdmin } from '../helper/auth.js'

// POST - create
router.post('/product', requireToken, isAdmin, formidable(), async (req, res) => {
    try {
        // console.log(req.fields)
        // console.log(req.files)
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        // validation
        switch(true) {
            case !name.trim():
                return res.json({ error: 'Name is required'})
            case !description.trim():
                return res.json({ error: 'Description is required'})
            case !price.trim():
                return res.json({ error: 'Price is required'})
            case !category.trim():
                return res.json({ error: 'Category is required'})
            case !shipping.trim():
                return res.json({ error: 'Shipping is required'})
            case photo && photo.size > 1000000:
                return res.json({ error: 'Photo must be less than 1mb in size'})
        }

        // create product
        const product = new Product({...req.fields, slug: slugify(name) })
        if(photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()
        res.json(product)

    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
})

// PUT - update
router.put('/product/:productId', requireToken, isAdmin, formidable(), async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        // validation
        switch(true) {
            case !name.trim():
                return res.json({ error: 'Name is required'})
            case !description.trim():
                return res.json({ error: 'Description is required'})
            case !price.trim():
                return res.json({ error: 'Price is required'})
            case !category.trim():
                return res.json({ error: 'Category is required'})
            case !shipping.trim():
                return res.json({ error: 'Shipping is required'})
            case photo && photo.size > 1000000:
                return res.json({ error: 'Photo must be less than 1mb in size'})
        }

        // update product
        const product = await Product.findByIdAndUpdate(
            req.params.productId, 
            { ...req.fields, slug: slugify(name), },
            { new: true }
        )

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()
        res.json(product)

    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
})

// DELETE
router.delete('/product/:productId', requireToken, isAdmin, async (req, res) => {
    try {
        const removed = await Product.findByIdAndDelete(req.params.productId).select("-photo")
        res.json(removed)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
})
// INDEX
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({}).populate('category').select("-photo").limit(12).sort({createdAt: -1})
        res.json(products)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
})
// SHOW
router.get('/product/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).populate('category').select("-photo")
        res.json(product)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
})

// photo route
router.get('/product/photo/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).select("photo")
        if(product.photo.data) {
            res.set('Content-Type', product.photo.contentType)
            return res.send(product.photo.data)
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
})

router.post('/filtered-products', async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }

        console.log('args =>', args)
        
        const products = await Product.find(args)
        res.json(products)
        console.log(products.length)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
})

router.get('/products-count', async (req, res) => {
    try {
        const total = await Product.find({}).estimatedDocumentCount()
        res.json(total)
    } catch (err) {
        console.log(err)
    }
})

router.get('/list-products/:page', async (req, res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1

        const products = await Product.find({})
            .select('-photo')
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
            
        res.json(products)
    } catch (err) {
        console.log(err)
    }
})

export default router