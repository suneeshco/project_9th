const Admin=require("../models/userModel")
const bcrypt=require("bcrypt");

const securePassword=async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    }catch(err){
        console.log(err.message)
    }
}

const loadAdminLogin=async(req,res)=>{
    try{
        if (req.session.admin_id) {
            return res.redirect('/admin/dashboard'); // Redirect to the home page
        }else{
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.render("adminLogin")
        }
        
        
    }catch(err){
        console.log(err.message);
    }
}



const verifyAdmin=async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
    
        const adminData=await Admin.findOne({email:email})
        if(adminData){
            const passwordMatch=await bcrypt.compare(password,adminData.password);
            if(passwordMatch){
                if(adminData.is_admin){
                    req.session.admin_id=adminData._id;
                    // req.session.authenticated=true;
                    res.redirect("/admin/dashboard");
                }else{
                    return res.render("adminLogin",{message:"Invalid credentials!"})
                }
                
            }else{
                return res.render("adminLogin",{message:"Invalid credentials!"})
            }
        }else{
            return res.render("adminLogin",{message:"Invalid credentials!"})
        }
    }catch(err){
        console.log(err.message)
    }
    
}

// Dashboard

const loadDashboard=async(req,res)=>{
    try{
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            const userData=await Admin.find({is_admin:0})
            res.render("dashboard",{users:userData})
        
    }catch(err){
        console.log(err.message)
    }
}


const editUser=async(req,res)=>{
    try {
        const userData = await Admin.findByIdAndUpdate({ _id:req.body.id },{ $set:{ name:req.body.name, email:req.body.email, mobile:req.body.mno} });
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error.message);
    }
}

const editUserLoad=async(req,res)=>{
    try{
        const id=req.query.id;
        const userData=await Admin.findOne({_id:id});
        if(userData){
            res.render("edit-user",{user:userData})
        }else{
            res.redirect("/admin/dashboard")
        }
    }catch(error){
        console.log(error.message)
    }
}

const deleteUser = async(req,res)=>{
    try {
        const id = req.query.id;
        await Admin.deleteOne({ _id:id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}


const addUserLoad=async(req,res)=>{
    try{
        res.render("add-user")
    }catch(error){
        console.log(error.message)
    }
}

const addUser=async(req,res)=>{
    try{
        const name=req.body.name
        const email=req.body.email
        const mobile=req.body.mno
        const password=req.body.password
        const emailMatch=await Admin.findOne({email:email});
        const mobileMatch=await Admin.findOne({mobile:mobile});
        if(emailMatch){
            res.render("add-user",{message:"Email already exist!"});
        }else if(mobileMatch){
            res.render("add-user",{message:"Mobile already exist!"})
        }else{
            const sPassword=await securePassword(password)
            const user=new Admin({
                name:name,
                email:email,
                mobile:mobile,
                password:sPassword,
                is_admin:0
            })

            const userData=await user.save()
            if(userData){
                res.redirect("/admin/dashboard")
            }else{
                res.render("/admin/add-user",{message:"Something went wrong"});
            }
        }
    }catch(error){
        console.log(error.message)
    }
}

const adminLogout=async(req,res)=>{
    try{
        req.session.destroy()
        res.redirect("/admin")
        }catch(err){
        console.log(err.message)
    }
}

const searchUser = async (req, res) => {
    try {

        const searchCriteria = req.body.searchCriteria;
        const users = await Admin.find({
            $and: [
                { name: { $regex: `^${searchCriteria}`, $options: 'i' } }, // Starts with 'a' search
                { name: { $not: { $eq: 'Admin' } } } // Exclude records where name is 'admin' (case-insensitive)
            ]
        });

        res.render('search', { users });

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}

module.exports={
    loadAdminLogin,
    loadDashboard,
    verifyAdmin,
    adminLogout,
    editUser,
    editUserLoad,
    deleteUser,
    addUserLoad,
    addUser,
    searchUser
}