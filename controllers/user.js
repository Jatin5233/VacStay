const User=require("../models/user.js");

module.exports.renderSignup=(req,res)=>{
    res.render("../views/users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body
        let newUser=new User({email,username})
        let registeredUser=await User.register(newUser,password)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to VacStay")
            res.redirect("/allListing")
        })
       
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signUp")
    }
    
}
module.exports.renderLogin=(req,res)=>{
    res.render("../views/users/login.ejs");
}
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to VacStay!")
    let redirectUrl=res.locals.redirectUrl||"/allListing"
    res.redirect(redirectUrl)
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You are Logged out!")
        res.redirect("/allListing")
    })
}