/* npm i hapi
*/
const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./routes/heroRoutes');

const app = new Hapi.Server( { port: 5001 } );

const mapRoutes = (instance, methods) => {
    return methods.map(method => instance[method]());
}

const main = async () => {

    const connection = MongoDB.connect();

    const context = new Context(new MongoDB(connection,HeroiSchema));

    app.route([
        ...mapRoutes(new HeroRoute(context),HeroRoute.methods())
    ])
        await app.start();
        console.log(`Servidor rodando na porta ${app.info.port}`);

        return app;
        
}

module.exports = main();