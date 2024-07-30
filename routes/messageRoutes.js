const express=require('express');
const { fetchMessage, makeGroup, fetchGroups, createChannel } = require('../controllers/messageController');
const router=express.Router();

router.get('/:channelId',fetchMessage);
router.post('/group',makeGroup);
router.get('/groups/:userId',fetchGroups);
router.post('/createChannel',createChannel);
module.exports=router;