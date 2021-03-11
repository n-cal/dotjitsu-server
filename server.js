//SERVER

const http = require('http');
const httpServer = http.createServer();
const app = require('./src/app');

const port = process.env.PORT || 3000;


const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*"
    }
});


app(io);


httpServer.listen(port, () => {
    console.log(`server listening on port ${port}`);
});

// setInterval(() => {
//     global.gc();
//     const heapUsed = process.memoryUsage().heapUsed / (1024 * 1024);
//     console.log(`heap used: ${heapUsed}`);
// }, 10000);