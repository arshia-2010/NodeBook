const express = require("express")
const router = express.Router()
const Block = require("../models/Block")
const multer = require("multer")

const storage = multer.diskStorage({

destination: function(req, file, cb) {
    cb(null, "uploads/")
},

filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
}

})

const upload = multer({ storage: storage })

router.post("/upload", upload.single("file"), function(req, res){

    if(!req.file){
        return res.status(400).json({message: "No file uploaded"})
    }

    res.json({
        message: "File uploaded successfully",
        filename: req.file.filename,
        path: "/uploads/" + req.file.filename
    })

})

router.post("/blocks", async function(req,res){

    const block = new Block({
        pageId: req.body.pageId,
        type: req.body.type,
        content: req.body.content,
        order: req.body.order
    })

    await block.save()

    res.json(block)
})

router.get("/blocks/:pageId", async function(req,res){

    const blocks = await Block.find({
        pageId: req.params.pageId
    }).sort({order:1})

    res.json(blocks)
})

router.put("/blocks/:id", async function(req,res){

    const block = await Block.findByIdAndUpdate(
        req.params.id,
        {
            content: req.body.content
        },
        {new:true}
    )

    res.json(block)
})

router.delete("/blocks/:id", async function(req,res){

    await Block.findByIdAndDelete(req.params.id)

    res.json({message:"Block deleted"})
})

module.exports = router