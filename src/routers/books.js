const express=require('express');
const chalk=require('chalk');
let dateFormat = require('dateformat');

const { models } = require('mongoose');
const {booksModel}=require('../models/BooksModel');
const {libraryRegisterModel}=require('../models/libraryRegisterModel');
const {bookIssueModel}=require('../models/BookIssueModel');
const { memberModel } = require('../models/MembersModel');

let booksRouter=express.Router();

function routerHandler(){


    booksRouter.route('/')
    .get((req,res)=>{
        console.log(chalk.blue('books router called !'));
        res.json({status:'success'});
    });


    booksRouter.route('/add')
    .post((req,res)=>{
        console.log(chalk.blue('books add router called !\n'));

        let book={
            libraryId:req.body.libraryId,
            name:req.body.name,
            author:req.body.author,
            publisher:req.body.publisher,
            genre:req.body.genre,
            noOfPages:req.body.noOfPages,
            price:req.body.price,
            booksInHand:"",
            isAvilable:true,
            isDeleted:false
        }

        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify(book)));
        console.log(chalk.yellowBright('\n********************'));

        libraryRegisterModel.findOne({_id:req.body.libraryId},
            (err,result)=>{
                if(err){
                    console.log(chalk.redBright(`${err} error occured`));
                    res.json({status:'error'});
                }else if(!result){
                    res.json({status:'error',message:'library not found'});
                }
                else{
                    
                     if(result.isActive){
                             //save book

                     let books_model=new booksModel(book);
                        books_model.save((err,result)=>{
                            if(err){
                                console.log(chalk.redBright(err),"error in saving");
                                res.json({status:'error'});
                            }
                            else{
                                res.json({status:'success'});
                            }
                        });
                     }else{
                        res.json({status:'error',message:'library inactive'});
                     }
                   
                }
            });


        
    });

    booksRouter.route('/category-fetch').
    post((req,res)=>{
        console.log(chalk.blue('books delete router called !\n'));
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({libraryId:req.body.libraryId,bookCategory:req.body.category})));
        console.log(chalk.yellowBright('\n********************'));
         
        libraryRegisterModel.findOne({_id:req.body.libraryId},
            (err,result)=>{
                if(err){
                    console.log(chalk.redBright(`${err} error occured`));
                    res.json({status:'error'});
                }else if(!result){
                    res.json({status:'error',message:'library not found'});
                }
                else{

                    booksModel.find({$and:[{genre:req.body.category},{libraryId:req.body.libaryId}]},(err,result)=>{
                        if(err){
                            console.log(chalk.redBright(`${err} error occured`));
                            res.json({status:'error'});
                        }else if(!result){
                            res.json({status:'error'});
                        }else{
                            res.json({status:'success',info:result})
                        }
            
                    }); 
   
                }
        });
        
    });

    booksRouter.route('/delete').
    post((req,res)=>{
        console.log(chalk.blue('books delete router called !\n'));
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({libraryId:req.body.libraryId,bookId:req.body.bookId})));
        console.log(chalk.yellowBright('\n********************'));
         
        libraryRegisterModel.findOne({_id:req.body.libraryId},
            (err,result)=>{
                if(err){
                    console.log(chalk.redBright(`${err} error occured`));
                    res.json({status:'error'});
                }else if(!result){
                    res.json({status:'error',message:'library not found'});
                }
                else{

                    booksModel.findByIdAndUpdate(req.body.bookId,{$set:{isDeleted:true}},
                        (err,result)=>{
                           console.log(result);
                            if(err){
                               console.log(chalk.blueBright('error to delete'),err);
                               res.json({ status:"error"});
                            }else if(!result){
                               res.json({status:'error',message:'book not found'}) 
                           }else{
                               res.json({status:'success'})  
                           }
                        });
   
                }
        });
        
    });

    booksRouter.route('/search').
    post((req,res)=>{
        console.log(chalk.blue('books search router called !\n'));
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({libaryId:req.body.libraryId,searchBy:req.body.searchBy,searchKey:req.body.searchKey})));
        console.log(chalk.yellowBright('\n********************'));
          
        libraryRegisterModel.findOne({_id:req.body.libraryId},
            (err,result)=>{
                if(err){
                    console.log(chalk.redBright(`${err} error occured`));
                    res.json({status:'error'});
                }else if(!result){
                    res.json({status:'error',message:'library not found'});
                }
                else{
                     
                    let searchBy=req.body.searchBy;
                    let search;
                    
                    // search by genre,book name,author and publisher

                    if(searchBy=="genre"){
                        booksModel.find({$and:[{isDeleted:false},{libraryId:req.body.libraryId},{genre:new RegExp(req.body.searchKey,'i')}]},
                            (err,result)=>{
                                if(err){
                                    console.log(chalk.redBright(`${err} error occured`));
                                    res.json({status:'error'});
                                }else if(!result){
                                    res.json({status:'error',message:'library has no books'});
                                }
                                else{
                                    
                                    res.json({status:'success',books:result})
    
    
                                }
                            });
                    }
                   else if(searchBy=="author"){
                        booksModel.find({$and:[{isDeleted:false},{libraryId:req.body.libraryId},{author:new RegExp(req.body.searchKey,'i')}]},
                        (err,result)=>{
                            if(err){
                                console.log(chalk.redBright(`${err} error occured`));
                                res.json({status:'error'});
                            }else if(!result){
                                res.json({status:'error',message:'library has no books'});
                            }
                            else{
                                
                                res.json({status:'success',books:result})


                            }
                        });
                    }
                   else if(searchBy=="name"){
                        booksModel.find({$and:[{isDeleted:false},{libraryId:req.body.libraryId},{name:new RegExp(req.body.searchKey,'i')}]},
                        (err,result)=>{
                            if(err){
                                console.log(chalk.redBright(`${err} error occured`));
                                res.json({status:'error'});
                            }else if(!result){
                                res.json({status:'error',message:'library has no books'});
                            }
                            else{
                                
                                res.json({status:'success',books:result})


                            }
                        });
                    }
                   else if(searchBy=="publisher"){
                       
                        booksModel.find({$and:[{isDeleted:false},{libraryId:req.body.libraryId},{publisher:new RegExp(req.body.searchKey,'i')}]},
                        (err,result)=>{
                            if(err){
                                console.log(chalk.redBright(`${err} error occured`));
                                res.json({status:'error'});
                            }else if(!result){
                                res.json({status:'error',message:'library has no books'});
                            }
                            else{
                                
                                res.json({status:'success',books:result})


                            }
                        });
                    }else{
                        res.json({status:'error',message:'try again'});
                    }

                   
                   


                }
            });

        
    });
      
    booksRouter.route('/issue').
    post((req,res)=>{
        
        let testDate = new Date();
        testDate.setDate(testDate.getDate() + (4*7));
        let book;
        
        let issue={
            bookId:req.body.bookId,
            memberId:req.body.memberId,
            libraryId:req.body.libraryId,
            dateOfRent:dateFormat(Date.now(),"dddd, mmmm dS, yyyy, h:MM:ss TT"),
            dateOfReturn:dateFormat(testDate,"dddd, mmmm dS, yyyy, h:MM TT"),
            isDeleted:false
        }
       
           
        console.log(chalk.blue('books issue router called !\n'));
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify(issue)));
        console.log(chalk.yellowBright('\n********************'));
         
        memberModel.findOne({_id:req.body.memberId},(err,result)=>{
            if(err){
                console.log(chalk.redBright(`${err} error occured`));
                res.json({status:'error'});
            }else if(!result){
                res.json({status:'error',message:'book not found'});
            }
            else{
                  if(result.limit==0){
                      res.json({status:'error',message:'limit reached'});
                  }else{
                        
                        
                        // console.log(result);
                        let lmt=result.limit-1;
                        let book_in_hand=[];
                        book_in_hand=result.booksInHand;
                        // console.log(book_in_hand);
                        
                        book_in_hand.push(req.body.bookId);
                        let member={
                            memId:result.memId,
                            libraryId:result.libraryId,
                            email:result.email,
                            name:result.name,
                            password:result.password,
                            membershipDate:result.membershipDate,
                            booksInHand:book_in_hand,
                            limit:lmt,
                            isActive:true
                        }

                        booksModel.findOne({_id:req.body.bookId},(err,result)=>{
                            if(err){
                                console.log(chalk.redBright(`${err} error occured`));
                                res.json({status:'error'});
                            }else if(!result){
                                res.json({status:'error',message:'book not found'});
                            }
                            else{
                                if(result.isAvilable){

                                     book={
                                        libraryId:result.libraryId,
                                        name:result.name,
                                        author:result.author,
                                        publisher:result.publisher,
                                        genre:result.genre,
                                        noOfPages:result.noOfPages,
                                        price:result.price,
                                        bookInhand:req.body.memberId,
                                        isAvilable:false,
                                        isDeleted:false
                                    }
                                    let books__issue_model=new bookIssueModel(issue);
                                    books__issue_model.save((err,result)=>{
                                        if(err){
                                            console.log(chalk.redBright(err),"error in saving");
                                            res.json({status:'error'});
                                        }
                                        else{
                                                 
                                            
                                              
                                            
                                            console.log("haa books",book);
                                           
                                                    // updating books and members
                                                    booksModel.findByIdAndUpdate(req.body.bookId,{$set:book},
                                                        (err,result)=>{
                                                        console.log(result);
                                                            if(err){
                                                            console.log(chalk.blueBright('error to update book'),err);
                                                            res.json({ status:"error"});
                                                            }else if(!result){
                                                            res.json({status:'error',message:'book not found'}) 
                                                        }else{
                                                            
                                                            
                                                                memberModel.findByIdAndUpdate(req.body.memberId,{$set:member},
                                                                    (err,result)=>{
                                                                    console.log(result);
                                                                        if(err){
                                                                        console.log(chalk.blueBright('error to update member'),err);
                                                                        res.json({ status:"error"});
                                                                        }else if(!result){
                                                                        res.json({status:'error',message:'member not found'}) 
                                                                    }else{
                                                                        res.json({status:'success'});
                                                                    }
                                                                    });
                                                        }
                                                    });
                                            
    
                                                
                                              
                                                   
                    
                                                
                                        }
                                    });
                                }else{
                                    res.json({status:'error',message:'book inavilable'});
                                }
                                
                                  
                            }
                             
                        });

                  }
                     

            }
        });

        
        
        
    });
    





    booksRouter.route('/return')
    .post((req,res)=>{
        console.log(chalk.blue('books return router called !\n'));
        console.log(chalk.yellowBright('********************\n'));
        console.log(chalk.yellowBright(JSON.stringify({memberId:req.body.memberId,bookId:req.body.bookId,libaryId:req.body.libaryId})));
        console.log(chalk.yellowBright('\n********************'));

         
        bookIssueModel.findByIdAndUpdate(req.body.bookIssueId,{$set:{isDeleted:true,dateOfReturn:dateFormat(Date.now(),"dddd, mmmm dS, yyyy, h:MM:ss TT")}},
            (err,result)=>{
            console.log(result);
                if(err){
                console.log(chalk.blueBright('error to delete book'),err);
                res.json({ status:"error"});
                }else if(!result){
                res.json({status:'error',message:'book not found'}) 
            }else{
                   booksModel.findByIdAndUpdate(req.body.bookId,{$set:{isAvilable:true,bookInhand:""}},
                    (err,result)=>{
                    console.log(result);
                        if(err){
                        console.log(chalk.blueBright('error to delete book'),err);
                        res.json({ status:"error"});
                        }else if(!result){
                        res.json({status:'error',message:'book not found'}) 
                    }else{
                              // updating member
                                
                                
                                memberModel.findOne({_id:req.body.memberId},(err,result)=>{
                                    if(err){
                                        console.log(chalk.redBright(`${err} error occured`));
                                        res.json({status:'error'});
                                    }else if(!result){
                                        res.json({status:'error',message:'book not found'});
                                    }
                                    else{
                                        
                                                
                                                // console.log(result);
                                                let lmt=result.limit+1;
                                                let book_in_hand=[];
                                                book_in_hand=result.booksInHand;
                                                // console.log(book_in_hand);
                                                
                                                var idx =book_in_hand.indexOf(req.body.bookId);
                                                if (idx !== -1) {
                                                book_in_hand.splice(idx,1) 
                                                }



                                                
                                                let member={
                                                    memId:result.memId,
                                                    libraryId:result.libraryId,
                                                    email:result.email,
                                                    name:result.name,
                                                    password:result.password,
                                                    membershipDate:result.membershipDate,
                                                    booksInHand:book_in_hand,
                                                    limit:lmt,
                                                    isActive:true
                                                }
                                                
                                                memberModel.findByIdAndUpdate(req.body.memberId,{$set:member},
                                                    (err,result)=>{
                                                    console.log(result);
                                                        if(err){
                                                        console.log(chalk.blueBright('error to update member'),err);
                                                        res.json({ status:"error"});
                                                        }else if(!result){
                                                        res.json({status:'error',message:'member not found'}) 
                                                    }else{
                                                        res.json({status:'success'});
                                                    }
                                                });
                                                
                                                            
                                                 


                                        
                                    }
                                });

                               


                    }
                });
            }
        });

    });

   

    // Astrology,Autobiography,Agriculture,Amar Chithrakadha,Biography,Children&#8217;s Literature,Cookery,Drama,EDUCATION,English Books,FICTION,General Knowledge,Health,History,Interview,Law,MEDICAL,MYTH &#038; TALES,Novel,Philosophy,Poems,Science,Spiritual,Sports,Translation,Travelogue,Yoga,




  return booksRouter;
}



module.exports=routerHandler;