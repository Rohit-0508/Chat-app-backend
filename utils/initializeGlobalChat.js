const Channel = require('../models/Channel');
const Message = require('../models/Message');


const initializeGlobalChat=async()=>{
    try{
        let globalChat=await Channel.findOne({isGlobal:true});
        console.log('Hey this is the global chat ');
        if(!globalChat){
            globalChat= new Channel({
                name:'Global Chat',
                description:'Global Chat for all Users',
                
                isGlobal:true
            });
            await globalChat.save();
            console.log('Global chat channel has been initialized');
        }
    }catch(error){
        console.log('Error initializing global chat',error);
    }
};

module.exports=initializeGlobalChat;