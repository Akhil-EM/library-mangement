const mongoose =require('mongoose');

const BookIssueSchema=new mongoose.Schema({
    bookId:{
        type:String,
        required:true
    },
    memberId:{
       type:String,
       required:true
    },
    libraryId:{
        type:String,
        required:true
    },
    dateOfRent:{
        type:String,
        required:true,
        
    },
    dateOfReturn:{
        type:String,
        required:true,
        
    },
    isDeleted:{
        type:String,
        required:true
    }
});

let bookIssueModel=mongoose.model('bookIssue',BookIssueSchema);
module.exports={bookIssueModel};