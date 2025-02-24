if(process.env.NODE_ENV!="production"){
    require("dotenv").config()
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js")
const listing=require("./routes/listing.js")
const review=require("./routes/review.js")
const user=require("./routes/user.js")
const session=require("express-session");
const MongoStore=require("connect-mongo")
const flash=require("connect-flash");
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js");

const dbUrl=process.env.ATLASDB_URL

async function main(){
    await mongoose.connect(dbUrl)
}
main()
.then(()=>{
    console.log("Database connected");
})
.catch((err)=>{
    console.log(err);
})

app.set("views engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("method"));
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate)

const mongoClientPromise = new Promise((resolve) => {
    mongoose.connection.on("connected", () => {
        const client = mongoose.connection.getClient();
        resolve(client);
    });
});

const store=MongoStore.create({
    mongoUrl:dbUrl,
    clientPromise: mongoClientPromise,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
store.on("error",(err)=>{
    console.log("MONGO STORE ERROR",err)
})
const sessionOption={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUnintialized:true,
    cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOption))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currentUser=req.user
    next()
})


app.use("/allListing",listing)
app.use("/allListing/:id/reviews",review)
app.use("/",user)
app.get("/",(req,res)=>{
    res.send(hello)
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"))
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    console.log(err);
    res.status(statusCode).render("./listing/error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("server is listening")
})
