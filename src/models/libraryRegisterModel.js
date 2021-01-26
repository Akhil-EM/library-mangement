// require modules

const mongoose=require('mongoose');

const libraryRegisterSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
         type:String,
         required:true,
    },
    registrationNo:{
        type:String,
        required:true
    },
    EstablishedDate:{
        type:String,
        required:true
    },
    place:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true
    }
});

var libraryRegisterModel=mongoose.model('library',libraryRegisterSchema);
module.exports={libraryRegisterModel};