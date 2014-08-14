var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
var exec = require('child_process').exec;

app.listen(3000);

function handler (req, res) {
  fs.readFile('index.html',
  function (err, data) {
    if(err) {
      res.writeHead(404);
      return res.end('index.html not found.');
    }
    res.writeHead(200);
    res.write(data);
    res.end();
  });
}

console.log('Server start...');
io.sockets.on('connection', function (socket) {
  socket.on('command', function (data) {
    exec(data, function(err, console_output, stderr){
      //console.log(stderr);
      if(stderr != ""){
        socket.emit('console', "$ " + data + "\n" + stderr);
      }else{
        socket.emit('console', "$ " + data + "\n" + console_output);
      }
    });
    exec('pwd', function(err, pwd, stderr){
      socket.emit('pwd', pwd);
    });
    console.log(data);
  });
});
