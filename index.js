const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/ums")


const express=require("express");
const app=express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))

const userRoute=require("./routes/userRoute")
const adminRoute=require("./routes/adminRoute")

app.use("/",userRoute)
app.use("/",adminRoute)

app.listen("3000",()=>{
    console.log("server running...")
})