const mongoose=require('mongoose');

const messageSchema= new mongoose.Schema({
    content: {
         type: String, 
         required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    channel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Channel' ,
        
    },
    createdAt:{
        type:Date
    }

});

const Message= mongoose.model('Message',messageSchema);

module.exports=Message;