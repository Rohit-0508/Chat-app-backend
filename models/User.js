const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        default:'member'
    },
    avatar:{
        type:String,
        default:'/default-avatar.svg'
    },
    googleId:{
        type:String
    }
});

const User= mongoose.model('User',userSchema);

module.exports=User;