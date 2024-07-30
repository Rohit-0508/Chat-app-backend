const mongoose=require('mongoose');
const{MONGODB_URI}=require('../config/config');

const MongoDB=async()=>{
    try{
        await mongoose.connect(MONGODB_URI);
        console.log('Connected with the database');
    }catch(error){
        console.log('Error Connecting the database : ',error);
    }
    
}
MongoDB();
module.exports=mongoose.connection;