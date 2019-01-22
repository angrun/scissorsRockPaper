const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

users = [];
conections = [];
choices = [];

server.listen(process.env.PORT || 7510);
console.log('Server running');


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')

});

io.sockets.on('connection', function (socket) {
    conections.push(socket);

    console.log(choices);
    console.log('current socket ' + socket.id);
    console.log('Connected: %s sockets connected', conections.length);
    if (conections.length >= 3) {
        io.sockets.connected[conections[conections.length - 1].id].emit('connections', {msg: 3});
    }

    socket.on('disconnect', function (data) {
        conections.splice(conections.indexOf(socket), 1);
        if (!socket.username) return;
        //Remove users
        users.splice(users.indexOf(socket.username), 1);

        //Remove his choice
        choices.splice(choices.indexOf(socket.choice), 1);

        console.log('Disconnected: %s sockets connected', conections.length);

    });

    //Get Data
    socket.on('send message', function (data) {
        socket.username = data;
        users.push(data);
        console.log(users);

    });

    //Get Choices
    socket.on('get choice', function (data) {
        socket.choice = JSON.parse(data);
        choices.push(JSON.parse(data));
        console.log(choices);

    });

    var refreshIntervalId = setInterval(function () {
        if (choices.length === 2) {
            socket.emit('result', choices);
            console.log('here');
            clearInterval(refreshIntervalId);
        }

    }, 100)


});


