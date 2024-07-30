const passport= require('passport');
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const User=require('../models/User');
const {GOOGLE_CLIENT_SECRET,GOOGLE_CLIENT_ID}=require('./config');
const generateToken=require('../utils/GenerateToken')

passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback',
},

async(accessToken,refreshToken,profile,done)=>{
    const existingUser=await User.findOne({googleId:profile.id});

    if(existingUser){
        const token=generateToken(existingUser._id)
        return done(null,{user:existingUser,token});
    }
    const newUser=new User({
        username:profile.displayName,
        email:profile.emails[0].value,
        googleId:profile.id,
        avatar:profile.photos[0].value,
    });
    const savedUser=await newUser.save();
    const token=generateToken(savedUser._id);
    done(null,{user:savedUser,token});
}));

passport.serializeUser((data,done)=>{
    done(null,{id:data.user.id,token:data.token});
});

passport.deserializeUser(async(data,done)=>{
    try{
        const user= await User.findById(data.id);
        if(user){
            user.toke=data.token;
        }
        done(null,user);
    }
    catch(error){
        done(error,null);
    }
});

module.exports=passport;