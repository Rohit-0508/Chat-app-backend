const { Server } = require('socket.io');
const Message = require('../models/Message');
const User = require('../models/User');
const Channel = require('../models/Channel');

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join a channel
        socket.on('joinChannel', (channelId) => {
            socket.join(channelId);
            console.log(`User ${socket.id} joined channel ${channelId}`);
        });

        // Leave a channel
        socket.on('leaveChannel', (channelId) => {
            socket.leave(channelId);
            console.log(`User ${socket.id} left channel ${channelId}`);
        });

        // Send a message
        socket.on('sendMessage', async (messageData) => {
            try {
                const { content, authorId, channelId } = messageData;

                const user = await User.findById(authorId);
                if (!user) {
                    throw new Error('User not found');
                }

                const newMessage = new Message({
                    content,
                    author: authorId,
                    channel: channelId,
                    createdAt: new Date(),
                });

                await newMessage.save();

                const channel = await Channel.findById(channelId);
                if (!channel) {
                    throw new Error('Channel not found');
                }

                channel.messages.push(newMessage._id);
                await channel.save();

                io.to(channelId).emit('message', {
                    _id: newMessage._id,
                    content: newMessage.content,
                    author: {
                        _id: user._id,
                        username: user.username,
                        avatar: user.avatar,
                    },
                    channel: newMessage.channel,
                    createdAt: newMessage.createdAt,
                });

            } catch (error) {
                console.error('Error saving message:', error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = setupSocket;
