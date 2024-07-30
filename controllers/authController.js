const User = require('../models/User');
const bcyrpt = require('bcryptjs');
const generateToken=require('../utils/GenerateToken');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username,email,password);
        if (!username || !email || !password) {
            return res.status(501).json({ error: 'Some Credentials are missing' });
        }
        console.log('hey');
        const existingUser = await User.findOne({email});
        console.log('hello')
        if (existingUser) {
            return res.status(500).json({ error: 'This user already Exists' })
        }
        const hashedPassword = await bcyrpt.hash(password, 5);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        
        const savedUser=await newUser.save();
        const token=generateToken(savedUser._id);
        
        return res.status(200).json({ message: 'User has been registered successfully',token });
    } catch (error) {
        return res.status(500).json({ error: `Error registering the user to the database ${error}` });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please enter all the credentials" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please register" });
        }
        const isMatch = bcyrpt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ error: `hey buddy!! Wrong password` });
        }
        const token=generateToken(user._id);
        return res.status(200).json({ message: "Welcome back buddy!!!",token });

    } catch (error) {
        return res.status(500).json({ error: 'Error registering the user:', error });
    }
}

exports.getUser = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ error: "hey bro there are no uses " });
        }
        return res.status(200).json({
            message: `Fetched Successfully`,
            users: users.map(user => ({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }))

        });

    } catch (error) {
        res.status(500).json({ error: `There has been an error fetching the user from the database` });
    }
}

exports.user=async(req,res)=>{
    try {
        // req.user contains the decoded user information from the token
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user: user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.users=async(req,res)=>{
    const searchQuery=req.query.q || '';
    try{
        const users=await User.find({
            username:new RegExp(searchQuery,'i')
        }).select('username _id');
        res.json(users);
    }catch(error){
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    
}