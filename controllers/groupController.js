const Channel = require("../models/Channel");
const Group = require("../models/Group");
const Message = require("../models/Message");

exports.makeGroup = async (req, res) => {
    const { name, description, adminId, members, channelName } = req.body;
    try {
        const existingGroup = await Group.findOne({ name });

        if (existingGroup) {

            return res.status(400).json({ error: 'Group with this name is already there' });
        }
        const newGroup = new Group({
            name,
            description,
            admin: adminId,
            members: [...members, adminId]
        })

        await newGroup.save();
        const newChannel = new Channel({
            name: channelName || name,
            description: `Channel for ${name}`,
            group: newGroup._id,
            members: [...members, adminId]

        });
        await newChannel.save();

        newGroup.channels.push(newChannel._id);
        await newGroup.save();

        res.status(201).json({ message: 'Group and channel has been created successfully', group: newGroup });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

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

exports.deleteGroup = async (req, res) => {
    const { groupId, adminId } = req.body;
    try {
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (group.admin.toString() !== adminId) {
            return res.status(403).json({ error: 'Only admin can delete the group' });
        }
        await Channel.deleteMany({ _id: { $in: group.channels } });

        await Group.findByIdAndDelete(groupId);
        res.json({ message: 'Group and associated channels deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting the group' });
    }
}

exports.addMembersToGroup=async(req,res)=>{
    const {groupId,adminId,members}=req.body;
    try{
        const group=await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (group.admin.toString() !== adminId) {
            return res.status(403).json({ error: 'Only admin can add members to the group' });
        }

        const newMembers=members.filter(memberId=>!group.members.includes(memberId));
        group.members.push(...newMembers);

        await group.save();
        res.json({message:'Members added Successfully',group});
    }catch (error) {
        console.error('Error adding members to group:', error.message);
        res.status(500).json({ error: 'Error adding members to the group' });
    }
};

exports.removeMembersFromGroup=async(req,res)=>{
    const {groupId,adminId,members}=req.body;
    try{
        const group=await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (group.admin.toString() !== adminId) {
            return res.status(403).json({ error: 'Only admin can add members to the group' });
        }
        
        group.members=group.members.filter(memberId=>!members.includes(memberId.toString()));
        
        await group.save();
        if (group.members.length === 0) {
           
            const channels = await Channel.find({ group: groupId });

            await Promise.all(channels.map(async (channel) => {
                await Channel.findByIdAndDelete(channel._id);
            }));

            await  Group.findByIdAndDelete(groupId);
            return res.status(200).json({ message: 'Group and all associated channels deleted as there are no members left' });
        }

        const channels= await Channel.find({group:groupId});

        await Promise.all(channels.map(async(channel)=>{
            channel.members=channel.members.filter(memberId=>!members.includes(memberId.toString()));
            await channel.save();
        }))

        await group.save();
        res.json({ message: 'User left the group and all associated channels successfully'});
    }catch (error) {
        console.error('Error adding members to group:', error.message);
        res.status(500).json({ error: 'Error removing members from the group' });
    }
};

exports.leaveGroup=async(req,res)=>{
    const {userId, groupId}=req.body;
    try{
        const group = await Group.findById(groupId);

        if(!group){
            return res.status(404).json({error:'Group not found'});
        }
        const isAdmin = group.admin.toString() === userId;

        group.members=group.members.filter(memberId=>memberId.toString()!=userId);
        await group.save();
        if (group.members.length === 0) {
           
            const channels = await Channel.find({ group: groupId });

            await Promise.all(channels.map(async (channel) => {
                await Channel.findByIdAndDelete(channel._id);
            }));

            await Group.findByIdAndDelete(groupId);
            return res.status(200).json({ message: 'Group and all associated channels deleted as there are no members left' });
        }
        if(isAdmin){
            const newAdmin=Math.floor(Math.random()*group.members.length);
            console.log(newAdmin);
            group.admin= group.members[newAdmin];
            await group.save();
            console.log(group.admin);
        }

        const channels=await Channel.find({group:groupId});

        await Promise.all(channels.map(async(channel)=>{
            channel.members=channel.members.filter(memberId=>memberId.toString()!=userId);
            await channel.save();
        }))
        res.status(200).json({message:'Leaved the Group and all the other channels inside that group'});

    }catch(error){
        res.status(500).json({error:'Internal Server Error'})
    }
}

exports.changeGroupAdmin = async (req, res) => {
    const { groupId, newAdminId, currentAdminId } = req.body;

    try {
        
        const group = await Group.findById(groupId);

        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        
        if (group.admin.toString() !== currentAdminId) {
            return res.status(403).json({ error: 'Only the current admin can change the group admin' });
        }

        
        if (!group.members.includes(newAdminId)) {
            return res.status(400).json({ error: 'New admin must be a member of the group' });
        }

        
        group.admin = newAdminId;
        await group.save();

        res.status(200).json({ message: 'Group admin changed successfully' });

    } catch (error) {
        console.error('Error changing group admin:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


