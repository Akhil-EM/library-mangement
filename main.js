// importing modules
const express=require('express');
const chalk=require('chalk');
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const path=require('path');
const {Router}=require('express');

// declare a port
port=8080;
const app=new express();

// entry point of application
app.get('/',(req,res)=>{
    res.json({status:'success'});
});




app.listen(process.env.PORT || port,()=>{
     console.log(chalk.yellowBright(`Port ${port} is active !!`));
});