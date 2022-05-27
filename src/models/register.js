require('dotenv').config()
const bcrypt = require('bcryptjs');
const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not a valid email addresss');
            }
        }       
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        // maxlength:10,
        validate(value){
            if(value.length<6){
                throw new Error('Please enter >=6 characters');
            }
        }
    },
    tokens:{
        type:[{//array of objects
            token:{//each element of array
                type:String,
                required:true
            }
        }]
    
    }

})


//generating authToken
userSchema.methods.generateAuthToken=async(user)=>{
    try{
        // console.log(`this is ${user._id}`);
        const token= await jwt.sign({_id:user._id},process.env.SECRET_KEY);
        // console.log(`my token in models is ${token}`);
        user.tokens=user.tokens.concat({token});
        await user.save();
        
        return token
    }catch(e){
        console.log(e);
    }
}
userSchema.pre("save", async function(next){
    if(this.isModified('password'))
    {
        this.password=await bcrypt.hash(this.password,10);
    }
    next();

})

const User=new mongoose.model('User',userSchema);
module.exports=User;