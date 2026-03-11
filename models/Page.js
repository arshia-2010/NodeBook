const mongoose = require("mongoose")

const PageSchema = new mongoose.Schema({
    title: String
})

const Page = mongoose.model("Page", PageSchema)

module.exports = Page;