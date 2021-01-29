const express=require('express');
const chalk=require('chalk');


const { models } = require('mongoose');
const {booksModel}=require('../models/BooksModel');
const {libraryRegisterModel}=require('../models/libraryRegisterModel')
const {bookIssueModel}=require('../models/BookIssueModel')

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
            bookInhand:"",
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
     
    

    // Astrology,Autobiography,Agriculture,Amar Chithrakadha,Biography,Children&#8217;s Literature,Cookery,Drama,EDUCATION,English Books,FICTION,General Knowledge,Health,History,Interview,Law,MEDICAL,MYTH &#038; TALES,Novel,Philosophy,Poems,Science,Spiritual,Sports,Translation,Travelogue,Yoga,




  return booksRouter;
}



module.exports=routerHandler;