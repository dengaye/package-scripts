const net = require('net');

const isPortTaken = (port, host) => {
    const server = net.createServer().listen(port, host);
    return new Promise((resolve, reject) => {
        server.on('error', (e) => {
            reject(e);
        });

        server.on('listening', (e) => {
            server.close();
            resolve();
        })
    })
}

module.exports = isPortTaken;
