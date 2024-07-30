const express=require('express');
const { createChannel, fetchChannels, deleteChannel, addMemberToChannel, removeMemberfromChannel, leaveChannel } = require('../controllers/channelController');

const router=express.Router();

router.post('/createChannel',createChannel);
router.get('/:groupId/',fetchChannels);
router.delete('/deleteChannel',deleteChannel);
router.patch('/addMember',addMemberToChannel);
router.patch('/removeMember',removeMemberfromChannel);
router.patch('/leaveChannel',leaveChannel);
module.exports=router;