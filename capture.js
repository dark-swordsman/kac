const hook = require('iohook');
const net = require('net');

const buffer = [];

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log(data.toString());
    });

    socket.write('SERVER: Server started.');

    hook.on('keydown', e => {
        if (buffer.length < 20) {
            buffer.unshift(e.rawcode.toString());
        } else {
            buffer.pop();
            buffer.unshift(e.rawcode.toString());
        }
        
    });

    setInterval(() => {
        if (buffer.length > 0) {
            socket.write(buffer.pop());
        }
    }, 5);
}).on('error', (err) => {
    console.error(err);
});

// start server
hook.start();

server.listen(9899, () => {
    console.log('opened server on', server.address().port);
});