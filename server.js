//SERVER

const http = require('http');
const httpServer = http.createServer();
const app = require('./src/app');

const port = process.env.PORT || 3000;

const whitelist = ['http://192.168.0.103:8080', 'http://192.168.0.109:4200'];

const io = require('socket.io')(httpServer, {
    cors: {
        //origin: 'http://192.168.0.103:8080'
        origin: (origin, callback) => {
            if(whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS!'));
            }
        }
    }
});


app(io);


httpServer.listen(port, () => {
    console.log(`server listening on port ${port}`);
});