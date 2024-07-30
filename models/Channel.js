const mongoose=require('mongoose');

const channelSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{type:String},
    group:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
    }],
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    messages: [{
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Message' 
    }],
    isGlobal:{
        type:Boolean,
        default:false
    }
})
const Channel= mongoose.model('Channel',channelSchema);

module.exports=Channel;