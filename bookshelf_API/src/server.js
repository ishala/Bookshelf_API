const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost', 
        //MEMBUAT CORS AGAR LEBIH LUAS KE RANAH SERVER
        routes: {
            cors: {
                origin: ['*']
            }
        },
    });

    server.route(routes)
    await server.start();
    console.log(`Server tersedia pada ${server.info.uri}`);
};

init();