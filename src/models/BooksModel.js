const mongoose=require('mongoose');
const bookSchema=new mongoose.Schema({
    libraryId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    publisher:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    noOfPages:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    bookIssueDetails:[
          {bookInHandId:{type:String}},
          {bookIssueId:{type:String}},
          {rentersName:{type:String}}],
    isAvilable:{
        type:Boolean,
        required:true
    },
    isDeleted:{
        type:Boolean,
        required:true
    }

});


let booksModel=mongoose.model('books',bookSchema);
module.exports={booksModel}