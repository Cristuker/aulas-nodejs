const assert = require('assert');
const api = require('./../api');

let app = {};

describe('Suite de teste api heroes', function (){
    this.beforeAll( async () => {
        app = await api;
    })

    it('Listar /herois', async () =>{
        const result = await app.inject({
            method: 'GET',
            url:'/herois?skip=0&limit=10'
        })
        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    })

    it('listar/ herois deve retornar 10 registros', async () =>{
        
        const TAMANHO_LIMITE = 10;
        const SKIP = 0;
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=${SKIP}&limit=${TAMANHO_LIMITE}`
        })

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(dados.length === TAMANHO_LIMITE);
    })

    it('Listar heroi deve retornar com erro', async () =>{
        
        const TAMANHO_LIMITE = 'erro';
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0limit=${TAMANHO_LIMITE}`
        })

        const errorResult ={
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"skip\" fails because [\"skip\" must be a number]",
            "validation":{
                "source": "query",
                "keys": ["skip"]
            }
        }
        console.log('result',result.statusCode)
        console.log('result',result.payload)
        assert.deepEqual(result.statusCode, 400);
        assert.deepEqual(result.payload,JSON.stringify(errorResult));
    })

    it('listar/ herois deve filtrar um item', async () =>{
        
        const TAMANHO_LIMITE = 1000;
        const NAME = 'Clone do Batman-40';
        const SKIP = 0;

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=${SKIP}&limit=${TAMANHO_LIMITE}&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(dados[0].nome, NAME);
    })
})