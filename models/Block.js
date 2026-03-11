const mongoose = require("mongoose")

const BlockSchema = new mongoose.Schema({

    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Page"
    },

    type: String,

    content: String,

    order: Number
})

const Block = mongoose.model("Block", BlockSchema)

module.exports = Block