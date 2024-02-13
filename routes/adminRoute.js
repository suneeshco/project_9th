const express=require("express");
const bodyParser=require("body-parser")
const path=require("path")
const admin_route=express()
const session=require("express-session")
admin_route.set("view engine","ejs");
admin_route.set("views","./views/admin")

const adminController=require("../controllers/adminController")
admin_route.use(express.static("public"))
// user_route.use('/static', express.static(path.join(__dirname, 'public')))
// admin_route.use('/js', express.static(path.join(__dirname, 'public/js')))
admin_route.use('/styles', express.static(path.join(__dirname, 'public/styles')))

const admin=require("../config/config")
const auth=require("../middleware/adminAuth")

admin_route.use(session({
    secret: admin.adminSession,
    resave: false,
    saveUninitialized: true,
}));


admin_route.get("/admin",auth.isLogout,adminController.loadAdminLogin)
admin_route.get("/admin/dashboard",auth.isLogin,adminController.loadDashboard)
admin_route.post("/admin",adminController.verifyAdmin)
admin_route.get("/admin/logout",auth.isLogin,adminController.adminLogout)
admin_route.get('/admin/edit-user',auth.isLogin,adminController.editUserLoad);
admin_route.post('/edit-user',adminController.editUser);
admin_route.get("/admin/delete-user",auth.isLogin,adminController.deleteUser)
admin_route.get("/admin/add-user",auth.isLogin,adminController.addUserLoad)
admin_route.post('/admin/add-user',adminController.addUser);
admin_route.get("/admin/logout",auth.isLogin,adminController.adminLogout)
admin_route.post("/admin/search",auth.isLogin,adminController.searchUser)
// admin_route.get('*',function(req,res){
//     res.redirect('/admin');
// })

module.exports=admin_route