const express=require('express');
const chalk=require('chalk');


const { models } = require('mongoose');
const {libraryRegisterModel}=require('../models/libraryRegisterModel');
const { json } = require('body-parser');


let libraryRouter=express.Router();

function routerHandler(){


    libraryRouter.route('/')
    .get((req,res)=>{
        console.log(chalk.blue('library router called !'));
        res.json({status:'success'});
    });



    libraryRouter.route('/register')
    .post((req,res)=>{
        console.log(chalk.blue('library register router called !\n'));
        
        // collect all req data
        var library={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            registrationNo:req.body.registrationNo,
            EstablishedDate:req.body.EstablishedDate,
            place:req.body.place,
            pincode:req.body.pincode,
            isActive:false}

      console.log(chalk.yellowBright('********************\n'));
      console.log(chalk.yellowBright(JSON.stringify(library)));
      console.log(chalk.yellowBright('\n********************'));
      
      if(!(emailValidator(req.body.email))){
          res.json({status:'error',message:'invalid email'});
      }
      if(!(passwordValidator(req.body.password))){
        res.json({status:'error',message:'invalid password'});
      }
      if(!(pincodeValidator(req.body.pincode))){
        res.json({status:'error',message:'invalid pincode'});
      }
      
      
      var library_register_model=new libraryRegisterModel(library);

     //check whether email id exist or not  
     
     libraryRegisterModel.findOne({email:req.body.email},(err,result)=>{
         if(err){
             console.log(chalk.redBright(`${err} error occured`));
             res.json({status:'error'});
         }else if(!result){
            //  saving library informations
              
              library_register_model.save((err,result)=>{
                if(err){
                    console.log(chalk.redBright(err),"error in saving");
                    res.json({status:'error'});
                }
                else{
                    res.json({status:'success'});
                }
            });


         }else{
            res.json({ status:"error",message:"email exists"});
         }

     });


      

    });


    libraryRouter.route('/login')
    .post((req,res)=>{
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({email:req.body.email,password:req.body.password})));
        console.log(chalk.yellowBright('\n********************'));

        libraryRegisterModel.findOne({email:req.body.email,password:req.body.password},(err,result)=>{
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


    libraryRouter.route('/info')
    .post((req,res)=>{
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({id:req.body.id})));
        console.log(chalk.yellowBright('\n********************'));

        libraryRegisterModel.findOne({_id:req.body.id},(err,result)=>{
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

  return libraryRouter;
}

function emailValidator(email){
    let regex=/\S+@\S+\.\S+/
    if (regex.test(email))
    {
      return (true)
    }
      return (false)

}
function passwordValidator(pass){
    let regex=/.{6,}$/
    if (regex.test(pass))
    {
      return (true)
    }
      return (false)
}
function pincodeValidator(pin){
    let regex=/^\d{6}[0-9]*$/
    if (regex.test(pin))
    {
      return (true)
    }
      return (false)
}


module.exports=routerHandler;