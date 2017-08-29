var path = require('path');
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(4000, function(){
    console.log('waiting')
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    socket.on('event', function(data) {
    	console.log(data);
        socket.emit('news', {respones: '对呀！' + "你发送的是 : " + data.dt});
    });
});