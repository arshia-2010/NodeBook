const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const pageRoutes = require("./routes/pageRoutes")
const blockRoutes = require("./routes/blockRoutes")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

mongoose.connect(process.env.MONGO_URI)
.then(function(){
    console.log("MongoDB connected")
})
.catch(function(err){
    console.log(err)
})

app.use("/", pageRoutes)
app.use("/", blockRoutes)

app.listen(process.env.PORT, function(){
    console.log("Server running on port " + process.env.PORT)
})