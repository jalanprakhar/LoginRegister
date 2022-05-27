const express=require('express');
const router=new express.Router();
const cookieParser=require('cookie-parser');
const User=require('../models/register');

const bcrypt=require('bcryptjs');
const auth=require('../middleware/auth');
// const res = require('express/lib/response');
router.use(cookieParser());
router.get('/secret',auth,(req,res)=>{
    // console.log(req.cookies.jwt);
    res.render('secret');
})
router.get('/register',(req,res)=>{
    res.render('login');
})
router.post('/register',async(req,res)=>{
    try{
        const newUser= new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
        const token=await newUser.generateAuthToken(newUser)
        // console.log(`my token in router.js is ${token}`);
        await res.cookie("jwt",token,{
            expires:new Date(Date.now()+500000),
            httpOnly:true
        });
        // console.log('hi');
        
        await newUser.save();
        res.status(201).render('secret');
    }catch(e){
        res.status(400).send(e);
    }
})

router.post('/login',async(req,res)=>{
    try{
        const email=req.body.email;
        const currentUser=await User.findOne({email});
        // console.log(email);
        const match=await bcrypt.compare(req.body.password,currentUser.password)
        const token=await currentUser.generateAuthToken(currentUser);
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+50000),
            httpOnly:true,
            // secure:true
        });
        if(match){
            res.status(200).render('secret');
        }
        else res.status(400).send('Invalid password');
    }catch(e){
        res.status(400).send('Invalid Email');
    }
        
})


module.exports=router;