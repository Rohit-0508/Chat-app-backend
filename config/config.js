//File to exports all our important and private keys 
require('dotenv').config();

module.exports={
    MONGODB_URI:process.env.MONGODB_URI,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    SESSION_SECRET:process.env.SESSION_SECRET
}