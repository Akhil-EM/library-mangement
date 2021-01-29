const express=require('express');
const chalk=require('chalk');

let {adminModel}=require('../models/AdminModel');
let {libraryRegisterModel}=require('../models/libraryRegisterModel')


let adminRouter=express.Router();

function routeHandler(){
   
    adminRouter.route('/')
    .get((req,res)=>{
        console.log(chalk.blueBright('/admin called!!'));
        res.json({status:'success'});
    });

    adminRouter.route('/login')
    .post((req,res)=>{
        console.log(chalk.blue('admin login router called !\n'));
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({email:req.body.email,password:req.body.password})));
        console.log(chalk.yellowBright('\n********************'));

        adminModel.findOne({email:req.body.email,password:req.body.password},(err,result)=>{
            if(err){
                console.log(chalk.redBright(`${err} error occured`));
                res.json({status:'error'});
            }else if(!result){
                res.json({status:'error'});
            }else{
                res.json({status:'success',info:result})
            }

        }); 
    });
    
    adminRouter.route('/approve-library')
    .post((req,res)=>{
        console.log(chalk.blue('admin approvel router called !\n'));
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({id:req.body.libraryId,isActive:req.body.isActive})));
        console.log(chalk.yellowBright('\n********************'));


        libraryRegisterModel.findByIdAndUpdate(req.body.libraryId,{$set:{isActive:req.body.isActive}},
            (err,result)=>{
               console.log(result);
                if(err){
                   console.log(chalk.blueBright('error to delete'),err);
                   res.json({ status:"error"});
                }else if(!result){
                   res.json({status:'error',message:'library not found'}) 
               }else{
                   res.json({status:'success'})  
               }
        });
    });
    
   


    return adminRouter;
}

module.exports=routeHandler;