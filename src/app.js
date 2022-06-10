require('dotenv').config()
const express=require('express');
const path=require('path');
const app=express();
const port=process.env.PORT || 3000;
require('./db/conn');
const staticPath=path.join(__dirname,'../public');
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","hbs");
const RegisterRouter=require('./routers/register');
app.use(express.static(staticPath));
app.use(RegisterRouter);




app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
})
