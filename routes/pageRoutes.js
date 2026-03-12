const express = require("express")
const router = express.Router()
const Page = require("../models/Page")

router.post("/pages", async function(req,res){

    const page = new Page({
        title: req.body.title
    })

    await page.save()

    res.json(page)
})

router.get("/pages", async function(req,res){

    const pages = await Page.find()

    res.json(pages)
})

router.get("/pages/:id", async function(req,res){

    const page = await Page.findById(req.params.id)

    res.json(page)
})

router.delete("/pages/:id", async function(req,res){

    await Page.findByIdAndDelete(req.params.id)

    res.json({message:"Page deleted"})
})

module.exports = router