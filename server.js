// node lib
var path = require('path');

// 3rd-party lib
var connect = require('connect');
var serveStatic = require('serve-static');
var livereload = require('livereload');

var morgan = require('morgan');

// configuration
var port = 3000;
var root = path.join(__dirname, 'src');

// watch
var watchServer = livereload.createServer();
watchServer.watch(root);

// init web server
var app = connect();
app.use(morgan('combined'));
app.use(require('connect-livereload')({port: 35729}));
app.use(serveStatic(root));
app.listen(port);

// open browser
var url = 'http://localhost';
url += (port == 80 ? '' : ':' + port);

console.log('Debug server on ' + url);
require('open')(url);