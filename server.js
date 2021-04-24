const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users'); //this will bring the user info

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//this will help to make status the folder, which means that we can chose where the index will be taken from
app.use(express.static(path.join(__dirname, 'public'))); //here we stated that the folder 'public' will be index

const botName = 'ChatCord Bot';

//when user connects to server
io.on('connection', socket => {

    socket.on('joinRoom', ({ username , room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //this welcome the user
        socket.emit('mensaje', formatMessage(botName,'Bienvenido al chat!') );//this goes only to the user connecting

        //broadcast when user connects to the specific room
        socket.broadcast.to(user.room).emit('mensaje', formatMessage(botName,`${user.username} has joined the chat`));//this will be show to <everyone> except to the person that is connecting

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //listen for chatMessages
    socket.on('chatMessage', (msg) => {
        console.log(msg);
        io.emit('mensaje',msg);
        // const user = getCurrentUser(socket.id);
        //
        // io.to(user.room).emit('mensaje', formatMessage(user.username, msg));
    });


    //this runs when client disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'mensaje',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT =  process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on Port ${PORT}`) );