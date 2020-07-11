//jshint esversion:6
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
require('dotenv').config()


const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}))



mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})

const userSchema=new mongoose.Schema({
    email:String,
    password:String,
})

console.log(process.env.SECRET)

userSchema.plugin(encrypt, {secret: process.env.SECRET,encryptedFields: ['password']});
const User= new mongoose.model("User",userSchema);


app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password,
    });
newUser.save(function(err){
    if (err){
        console.log(err)
    }
    else{
        res.render("secrets");
    }
})
})
app.post("/login",function(req,res){
    const user=req.body.username;
    const pw=req.body.password;
    User.findOne({email:user} ,function(err,founduser){
        if (err){
            console.log(err) 
        }
        else{
            if( founduser)
            {
                if (founduser.password===pw){
                    res.render("secrets");
                }
                else{
                    res.send("<h1>Incorrect password</h1>")
                }
            }

        }
    })
})

app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login")
})
app.get("/register",function(req,res){
    res.render("register")
})
app.listen(3000,function(){
    console.log("Server started at port 3000");
})
