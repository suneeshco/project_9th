const express=require("express");
const bodyParser=require("body-parser")
const path=require("path")
const session=require("express-session")
const user_route=express()
user_route.set("view engine","ejs");
user_route.set("views","./views/users")
const auth=require("../middleware/userAuth")

const userController=require("../controllers/userController")
user_route.use(express.static("public"))
user_route.use('/static', express.static(path.join(__dirname, 'public')))
user_route.use('/js', express.static(path.join(__dirname, 'public/js')))
user_route.use('/styles', express.static(path.join(__dirname, 'public/styles')))
user_route.use(session({
    secret: 'abc123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24* 7 }
}));


user_route.get("/register",auth.isLogout,userController.loadRegister)
user_route.post("/register",userController.insertUser)
user_route.get("/",auth.isLogout,userController.loadlogin)
user_route.get("/home",auth.isLogin,userController.loadhome)
user_route.post("/",userController.verifyUser)
user_route.post('/',userController.verifyUser);
user_route.get("/logout",auth.isLogin,userController.userLogout)


module.exports=user_route