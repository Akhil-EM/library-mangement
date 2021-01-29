const mongoose=require('mongoose');

const adminSchma=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});


var adminModel=mongoose.model('admin',adminSchma);
module.exports={adminModel};