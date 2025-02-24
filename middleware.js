const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/expressError.js")
const {listingSchema}=require("./schema.js")
const {reviewSchema}=require("./schema.js")

const isLoggedIn=(req,res,next)=>{
    req.session.redirectUrl=req.originalUrl
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in!!!")
        return res.redirect("/login")
    }
    next()
}
const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}
const isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner!!")
        return res.redirect(`/allListing/${id}`)
    }
    next()
}
const isAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId)
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner!!")
        return res.redirect(`/allListing/${id}`)
    }
    next()
}
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
module.exports={isLoggedIn,saveRedirectUrl,isOwner,isAuthor,validateListing,validateReview};