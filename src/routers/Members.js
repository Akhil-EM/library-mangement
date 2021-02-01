const express=require('express');
const chalk=require('chalk');

let dateFormat = require('dateformat');
let {memberModel}=require('../models/MembersModel');
let {libraryRegisterModel}=require('../models/libraryRegisterModel');
let memberRouter=express.Router();

function routerHandler(){
    
    memberRouter.route('/')
    .get((req,res)=>{
        console.log(chalk.blueBright('/members called!!'));
        res.json({status:'success'});
    });
    

    memberRouter.route('/create')
    .post((req,res)=>{
        console.log(chalk.blueBright('/members creation called!!'));
         
        var member={
            memId:req.body.memberId,
            libraryId:req.body.libraryId,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            membershipDate:dateFormat(Date.now(),"dddd, mmmm dS, yyyy, h:MM:ss TT"),
            booksInHand:[],
            limit:3,
            isActive:true
        }
     
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify(member)));
        console.log(chalk.yellowBright('\n********************'));
        
        
        
        if(!idValidator(req.body.libraryId)){
            // console.log(idValidator(req.body.libraryId));
            res.json({status:'error',message:'invalid libraryId'});
            return;
        }
        // console.log(idValidator(req.body.libraryId));

        // checking if the library exist
        libraryRegisterModel.findOne({_id:req.body.libraryId},(err,result)=>{
            if(err){
                console.log(chalk.redBright(`${err} error occured`));
                res.json({status:'error'});
            }else if(!result){
              
                 
                 res.json({status:'error',message:'library not found'});
   
   
            }else{
               
                
               

                if(!emailValidator(req.body.email)){
                    res.json({status:'error',message:'invalid email'});
                    return;
                }
                
                // // check if the email id exist
                memberModel.findOne({email:req.body.email},(err,result)=>{
                    if(err){
                        console.log(chalk.redBright(`${err} error occured`));
                        res.json({status:'error'});
                    }else if(!result){
                             //everything ok saving userinfo
                             if(!passwordValidator(req.body.password)){
                                res.json({status:'error',message:'invalid password'});
                                return;
                            }

                            let member_model=new memberModel(member);
                            member_model.save((err,result)=>{
                                    if(err){
                                        console.log(chalk.redBright(err),"error in saving");
                                        res.json({status:'error'});
                                    }
                                    else{
                                        res.json({status:'success'});
                                    }
                            });
                         
                         
           
           
                    }else{
                        res.json({status:'error',message:'email exist'})
                    }
                });
                 

                

               


            }
   
        });
   

        
        
        


        


    });
    

    // memberRouter.route('/login')
    // .post((req,res)=>{
    //     console.log(chalk.blue('member login router called !\n'));
    //     console.log(chalk.yellowBright('********************\n'));
    //     console.log(chalk.yellowBright(JSON.stringify({email:req.body.email,password:req.body.password})));
    //     console.log(chalk.yellowBright('\n********************'));

    //     memberModel.findOne({email:req.body.email,password:req.body.password},(err,result)=>{
    //         if(err){
    //             console.log(chalk.redBright(`${err} error occured`));
    //             res.json({status:'error'});
    //         }else if(!result){
    //             res.json({status:'error'});
    //         }else{
    //             res.json({status:'success',info:result})
    //         }

    //     }); 
    // });
    

    // memberRouter.route('/info')
    // .post((req,res)=>{
    //     console.log(chalk.blue('member info router called !\n'));
    //     console.log(chalk.yellowBright('********************\n'));
    //     console.log(chalk.yellowBright(JSON.stringify({id:req.body.id})));
    //     console.log(chalk.yellowBright('\n********************'));

    //     memberModel.findOne({_id:req.body.id},(err,result)=>{
    //         if(err){
    //             console.log(chalk.redBright(`${err} error occured`));
    //             res.json({status:'error'});
    //         }else if(!result){
    //             res.json({status:'error'});
    //         }else{
    //             res.json({status:'success',info:result})
    //         }

    //     }); 
    // });


    memberRouter.route('/fetch-all')
    .post((req,res)=>{
        console.log(chalk.blue('member info router called !\n'));
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({libraryId:req.body.libraryId})));
        console.log(chalk.yellowBright('\n********************'));

        memberModel.find({libraryId:req.body.libraryId},(err,result)=>{
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

    memberRouter.route('/delete')
    .post((req,res)=>{
        console.log(chalk.blue('member delete router called !\n'));
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({libId:req.body.libraryId,memId:req.body.memberId})));
        console.log(chalk.yellowBright('\n********************'));
         
        // check for library exists and active
        libraryRegisterModel.findOne({_id:req.body.libraryId},(err,result)=>{
            if(err){
                console.log(chalk.redBright(`${err} error occured`));
                res.json({status:'error'});
            }else if(!result){
                res.json({status:'error',message:'library not found'}) 
            }else{
                console.log('reult',result);
                // res.json({status:'success'})
                 
                //delete if the library is active
                if(result.isActive){
                   memberModel.findByIdAndUpdate(req.body.memberId,{$set:{isActive:false}},
                     (err,result)=>{
                        console.log(result);
                         if(err){
                            console.log(chalk.blueBright('error to delete'),err);
                            res.json({ status:"error"});
                         }else if(!result){
                            res.json({status:'error',message:'user not found'}) 
                        }else{
                            res.json({status:'success'})  
                        }
                     });

                    


                    
                }else{
                    res.json({status:'error',message:'library inactive'})
                }
               
                
            }
        });
        
    });


  return memberRouter;
}
function emailValidator(email){
    let regex=/\S+@\S+\.\S+/
    if (regex.test(email))
    {
      return (true)
    }
      return (false)

}
function idValidator(id){
    let regex=/^\w{24,24}$/
    if (regex.test(id))
    {
      return (true)
    }
      return (false)
}
function passwordValidator(pass){
    let regex=/\S{6,}$/
    if (regex.test(pass))
    {
      return (true)
    }
      return (false)
}

module.exports=routerHandler;
