const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    let allListing=await Listing.find();
    res.render("./listing/index.ejs",{allListing})
}
module.exports.renderNewForm=(req,res)=>{
    
    res.render("listing/new.ejs")
}
module.exports.createListing=async(req,res)=>{
   let url=req.file.path
   let filename=req.file.filename
    let newListing=new Listing(req.body.listing)
    newListing.owner=req.user._id
    newListing.image={url,filename};
    await newListing.save()
    req.flash("success","Listing Successfully Created!")
    res.redirect("/allListing")
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","No such Listing Exist!")
        res.redirect("/allListing")
    }
    res.render("./listing/show.ejs",{listing})
}
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let orUrl=listing.image.url
    orUrl=orUrl.replace("/upload","/upload/w_250")
    res.render("./listing/edit.ejs",{listing,orUrl})
}
module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,req.body.listing);
    if(typeof(req.file)!=="undefined"){
    let url=req.file.path
    let filename=req.file.filename
    listing.image={url,filename}
    await listing.save()
    }
    req.flash("success","Listing Successfully Edited!")
    res.redirect(`/allListing/${id}`)
}
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Successfully Deleted!")
    res.redirect(`/allListing`)
}