const express=require('express');
const router=new express.Router();
const User=require('../models/register');
const bcrypt=require('bcryptjs');
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
        await newUser.generateAuthToken(newUser)
        // console.log(`my token in router.js is ${token}`);
        await newUser.save();
        res.status(201).render('login');
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
        await currentUser.generateAuthToken(currentUser);
        if(match){
            res.status(200).render('index');
        }
        else res.status(400).send('Invalid password');
    }catch(e){
        res.status(400).send('Invalid Email');
    }
        
})


module.exports=router;