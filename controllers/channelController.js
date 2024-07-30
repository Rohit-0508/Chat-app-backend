const Channel = require("../models/Channel");
const Group = require("../models/Group");

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

exports.fetchChannels=async(req,res)=>{
    const {groupId}=req.params;
    try{
        const channels=await Channel.find({group:groupId});
        res.json(channels);
    }catch(error){
        res.status(500).json({error:'fetching the channels'});
    }
};

exports.deleteChannel=async(req,res)=>{
    const {channelId,adminId,groupId}=req.body;

    try{
        const group= await Group.findById(groupId);
        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }console.log('upper the admin')
        if(group.admin.toString()!==adminId){
            
            return res.status(403).json({ error: 'Only admin can delete the channel' });
        }
    
        const channels= await Channel.findByIdAndDelete(channelId);

        group.channels = group.channels.filter(channel => channel.toString() !== channelId);
        await group.save();
    
        res.json({message:' Channel deleted successfully'});
        
        
    }catch(error){
        res.status(500).json({error:'Error deleting the channel'});
    }
}

exports.addMemberToChannel=async(req,res)=>{
    const {channelId,adminId,userId}=req.body;
    try{
        const channel= await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }
        const group=await Group.findById(channel.group);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        if (group.admin.toString() !== adminId) {
            return res.status(403).json({ error: 'Only admin can add members to the channel' });
        }
        if(channel.members.includes(userId)){
            return res.status(400).json({error:'User is already a member'});
        }
        
        channel.members.push(userId);

        await channel.save();
        res.json({ message: 'Member added successfully', channel });

    }catch(error){
        res.status(500).json({error:'Internal Server Error'});
    }
}

exports.removeMemberfromChannel=async(req,res)=>{
    const {userId,adminId,channelId}=req.body;
    try{
        const channel=await Channel.findById(channelId);
        
        if(!channel){
            return res.status(404).json({error:'No Channel found'});
        }
        const group=await Group.findById(channel.group);
        if(!group){
            return res.status(404).json({error:'No Group found'});
        }
        if(group.admin.toString()!=adminId){
            return res.status(400).json({error:'Only Admin can remove the member'});
        }
        
        channel.members = channel.members.filter(memberId => memberId && memberId.toString() !== userId);

        await channel.save();
        res.json({ message: 'Member removed successfully', channel });
    }catch (error) {
        res.status(500).json({error:'Internal Server Error'});
    }
}

exports.leaveChannel=async(req,res)=>{
    const {userId,channelId}=req.body;
    try{
        const channel=await Channel.findById(channelId);
        if(!channel){
            return res.status(404).json({error:'Channel not found'});
        }
        channel.members = channel.members.filter(memeberId=>memeberId.toString()!==userId);

        await channel.save();
        res.json({ message: 'Channel Left Successfully', channel });

    }catch(error){
        res.status(500).json({error:'Internal Server Error'});
    }
}