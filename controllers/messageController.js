 const Channel = require("../models/Channel");
const Group = require("../models/Group");
const Message = require("../models/Message");

exports.fetchMessage=async(req,res)=>{
    try{
        const {channelId}=req.params;
        
        const messages=await Message.find({channel:channelId}).populate('author','avatar');
        res.json(messages);

    }catch(error){
        res.status(500).json({error:'Failed to fetch message'});
    }
}

exports.makeGroup=async(req,res)=>{
        const{name,description,adminId,members,channelName}=req.body;
        

        
        try{
            const existingGroup=await Group.findOne({name});
           
            if(existingGroup){
                
                return res.status(400).json({error:'Group with this name is already there'});
            }
            const newGroup=new Group({
                name,
                description,
                admin:adminId,
                members:[...members,adminId]
            })
            
            await newGroup.save();
            const newChannel= new Channel({
                name:channelName || name,
                description:`Channel for ${name}`,
                group:newGroup._id
    
            });
            await newChannel.save();
            
            newGroup.channels.push(newChannel._id);
            await newGroup.save();
            
            res.status(201).json({message:'Group and channel has been created successfully',group:newGroup});
        }catch(error){
            console.error('Error creating group:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
};

exports.createChannel=async(req,res)=>{
    const {userId,groupId,channelName,members,description}=req.body;
    try{
        const group=await Group.findById(groupId);
        if(!group){
            return res.status(404).json({error:'Group not found'});
        }
        if(group.admin.toString()!==userId){
            return res.status(403).json({error:'only the group admin can make the channels'})
        }
        const newChannel=new Channel({
            name:channelName,
            description,
            group:groupId,
            members:members
        });
        const savedChannel= await newChannel.save();
        group.channels.push(savedChannel._id);
        await group.save();
        res.status(200).json(savedChannel);
    }catch(error){
        res.status(500).json({error:'Error creating the channel'});
    }
}

exports.fetchGroups = async (req, res) => {
    const { userId } = req.params;

    console.log('Fetching groups for userId:', userId);

    try {
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const findGroup = await Group.find({ members: userId });

       
        if (!findGroup || findGroup.length === 0) {
            return res.status(404).json({ error: 'No groups found for this user' });
        }

        res.json(findGroup);
        console.log('Groups found:', findGroup);
    } catch (error) {
        console.error('Error fetching groups:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

