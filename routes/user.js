const express=require("express");
const router=express.Router();
const userController=require("../controllers/user.js")
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");

router.get("/signUp",userController.renderSignup)

router.post("/signUp",wrapAsync(userController.signup))

router.get("/login",userController.renderLogin)

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),wrapAsync(userController.login))

router.get("/logout",userController.logout)

module.exports=router;