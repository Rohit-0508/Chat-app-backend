//Imported libraries
const express=require('express');
const cors=require('cors');
const http=require('http');
const morgan=require('morgan');

const session=require('express-session');


//Local files
const setupSocket=require('./connections/socket');
const database=require('./connections/db');
const initializeGlobalChat=require('./utils/initializeGlobalChat');
const passport=require('./config/passport');
const authRoutes=require('./routes/authRoutes');
const messageRoutes=require('./routes/messageRoutes');
const groupRoutes=require('./routes/groupRoutes');
const channelRoutes=require('./routes/ChannelRoutes');
const {PORT}=require('./config/config');
const {SESSION_SECRET}=require('./config/config');


const app=express();
const server=http.createServer(app);



app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));


initializeGlobalChat();
const io=setupSocket(server);

app.use(session({
    secret:SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRoutes);
app.use('/messages',messageRoutes);
app.use('/group',groupRoutes);
app.use('/channel',channelRoutes);

app.get('/',(req,res)=>{
    res.send('API is running');
})


//This will Start the Server for listening to different requests
server.listen(PORT,()=>{
    console.log(`Server is running on Port: ${PORT}`);
})