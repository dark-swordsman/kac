const ks = require('node-key-sender');
const net = require('net');

const hostname = 'localhost'; // chane this to work over the local network

let buffer = [];
const delay = 175;
const key1 = [192,50,52,54,56,48,187,9,87,82,89,73,80,221,20,68,70,72,75,186,13,90,67,66,77,190,16,91,32,92];
const key2 = [49,51,53,55,57,189,8,81,69,84,85,79,219,220,65,83,71,74,76,222,88,86,78,188,191,17,18];
let pause = false;

ks.setOption('globalDelayPressMillisec', delay);

const client = net.createConnection({ port: 9899, host: hostname }, () => {
    console.log('CLIENT: I connected to the server.');
    client.write('CLIENT: Hello server!');
});

client.on('data', (data) => {
    const dataFormatted = data.toString();

    const foundKey1 = key1.find(value => value == dataFormatted.toString());
    const foundKey2 = key2.find(value => value == dataFormatted.toString());

    const key = foundKey1 ? 'F19' : (foundKey2 ? 'F20' : null);

    if (key) {
        if (buffer.length < 3) {
            buffer.unshift(key);
        } else if (!pause) {
            pause = true;
            console.log(pause);
            ks.setOption('globalDelayPressMillisec', 1000);
            ks.sendKey(Math.random() > 0.5 ? 'F19' : 'F20');
            setTimeout(() => {
                buffer = [];
                ks.setOption('globalDelayPressMillisec', delay);
                pause = false;
            }, delay + 1000);
        }
    }
});

client.on('end', () => {
    console.log('CLIENT: I disconnected from the server.');
});

setInterval(() => {
    if (!pause && buffer.length > 0) {
        ks.sendKey(buffer.pop());
    }
}, delay + 1);