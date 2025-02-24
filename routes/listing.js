const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const listingController=require("../controllers/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const {storage}=require("../cloudConfig.js")
const multer=require("multer")
const upload=multer({storage})



router.get("/",wrapAsync(listingController.index))

router.get("/new",isLoggedIn,listingController.renderNewForm)

router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

router.get("/:id",wrapAsync(listingController.showListing))

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.editListing))

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

module.exports=router;