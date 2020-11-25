var express = require('express');
var socket = require('socket.io');
var PeerServer = require('peer').PeerServer;
var path = require('path')
//App
var app = express();

const users = {};

const socketToRoom = {};
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
  });

var server = app.listen(4000,function(){
    console.log("listening to 4000");
});

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const io = socket(server);

io.on('connection',function(socket){
   
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });
    socket.on('chat',function(data){
        io.sockets.emit('chat',data);
    })
    socket.on('typing',function(data){
        socket.broadcast.emit('typing',data);
    })
    socket.on('play',function(){
        // console.log("play node running...");
        socket.broadcast.emit('play',{});
    });
    socket.on('pause',function(){
        console.log("pause node running...");
        socket.broadcast.emit('pause',{});
    })
    socket.on('skip',function(data){
        socket.broadcast.emit('skip',data)
    })
    socket.on('rf',function(data){
        socket.broadcast.emit('rf',data)
    })
    socket.on('end',function(){
        socket.broadcast.emit('end',{});
    })
})

