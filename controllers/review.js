const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review)
    listing.reviews.push(newReview);
    newReview.author=req.user._id
    await newReview.save();
    
    console.log(newReview.author)
    await listing.save();
    req.flash("success","Review Successfully Created!")
    res.redirect(`/allListing/${id}`)
    console.log("review saved")
}
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
   
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Successfully Deleted!")
    res.redirect(`/allListing/${id}`)
}