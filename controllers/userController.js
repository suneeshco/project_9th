const User=require("../models/userModel")
const bcrypt=require("bcrypt");


const securePassword=async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    }catch(err){
        console.log(err.message)
    }
}

const loadRegister=async(req,res)=>{
    try{
        res.render("registration")
    }catch(err){
        console.log(err.message);
    }
}

const insertUser=async(req,res)=>{
    try{
        const checkEmail=await User.findOne({email:req.body.email});
        if(checkEmail){
            res.render("registration", { message: "Email already exists. Try again" });
        }else{
            const sPassword=await securePassword(req.body.password)
            const user=new User({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mno,
                password:sPassword,
                is_admin:0
            })

            const userData=await user.save()
            if(userData){
                res.redirect("/home")
            }else{
                res.render("registration",{message:"failed"});
            }
        }
      
        
       
    }catch (error) {
        console.log(error.message);
        }
}



//LOGIN

const loadlogin=async(req,res)=>{
    try{
        if (req.session.user) {
            return res.redirect('/home');
        }else{
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.render("login")
        }
        
    }catch(err){
        console.log(err.message);
    }
}

const verifyUser = async (req, res) => {
    try {
        const email= req.body.email;
        const password=req.body.password;
        const userData = await User.findOne({ email:email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                res.setHeader('cache-control','no-cache,no-store,must-revalidate');
                req.session.user_id = userData._id;
                return res.redirect("home");
            } else {
                return res.render("login", { message: "Invalid Credentials!" });
            }
            
        }else{
            return res.render("login", { message: "Invalid Credentials!" });
        }
       
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
};


//HOME
const loadhome=async(req,res)=>{
    try{
        const userData = await User.findById({ _id:req.session.user_id });
        if(userData){
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.render('home',{ user:userData });
        }else{
            res.redirect("/");
        }
        
    }catch(err){
        console.log(err.message);
    }
}

//LOGOUT

const userLogout=async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect("/")
    }catch(error){
        console.log(error.message)
    }
}

module.exports={
    loadRegister,
    insertUser,
    loadlogin,
    loadhome,
    verifyUser,
    userLogout
}