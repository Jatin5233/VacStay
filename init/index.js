const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
async function main(){
    await mongoose.connect("mongodb+srv://jatin_v2711:TnPs8YV14JLyRgCZ@cluster0.ddpnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}
main()
.then(()=>{
    console.log("Database connected");
})
.catch((err)=>{
    console.log(err);
})
const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'67bc29b8be20cb89c58bdbe6'}))
    await Listing.insertMany(initData.data);
    console.log("Data Saved")
}
initDB();