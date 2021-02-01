const mongoose=require('mongoose');
const memberSchema=new mongoose.Schema({
    memId:{
      type:String,
      required:true
    },
    libraryId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    membershipDate:{
        type:String,
        required:true
    },
    booksInHand:{
        type:[]
    },
    
    limit:{
        type:Number,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true
    }
});




var memberModel=mongoose.model('memebers',memberSchema);
module.exports={memberModel}