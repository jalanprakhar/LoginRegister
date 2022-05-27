require('dotenv').config()
const jwt=require('jsonwebtoken');
const User=require('../models/register');


const auth=async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser=await jwt.verify(token,process.env.SECRET_KEY);
        // console.log(verifyUser);

        const user=User.findOne({_id:verifyUser._id});
        console.log(user);
        next();
    }catch(e){
        res.status(e).send('Error');
    }
}
module.exports=auth;