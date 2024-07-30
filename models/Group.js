const mongoose=require('mongoose');
const groupSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{type:String},
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members:[{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }]
});

const Group = mongoose.model('Group',groupSchema);

module.exports=Group;