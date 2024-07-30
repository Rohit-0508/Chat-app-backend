const express=require('express');
const { makeGroup, fetchGroups, deleteGroup, addMembersToGroup, removeMembersFromGroup, leaveGroup, changeGroupAdmin } = require('../controllers/groupController.js');
const router=express.Router();

router.post('/create',makeGroup);
router.get('/groups/:userId',fetchGroups);
router.delete('/deleteGroup',deleteGroup);
router.patch('/addMember',addMembersToGroup);
router.patch('/removeMember',removeMembersFromGroup);
router.patch('/leaveGroup',leaveGroup);
router.patch('/changeAdmin',changeGroupAdmin);
module.exports=router;