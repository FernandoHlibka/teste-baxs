const http = require('http')

const { api } = require('./src');

// URLs of API
const URLS = {
    '/best-route' : { 
        fn: api.getBestRoute,
        method: 'POST',
        schema: [
            'curr',
            'dest'
        ]
    },
    '/new-route' : {
        fn: api.addNewRoute,
        method: 'POST',
        schema: [
            'name_route_a',
            'name_route_b',
            'price'
        ]
    }
}

const validateRequest = ({ parameters, reqUrl }) => {
    const reqSchema = URLS[reqUrl].schema,
        errorBag = [];

    parameters.forEach(param => {
        if(!reqSchema.includes(param)) {
            errorBag.push(`The parameter: ${param} is invalid`);
        }
    });

    if(!errorBag.length) {
        return true;
    }

    return errorBag;
}

// Method routes of API
const routes = async (req, res) => {
    try {
        const reqUrl = req.url;

        const validRequest = Object.keys(URLS).some(url => reqUrl === url && URLS[url].method === req.method);

        if(!validRequest) {
            throw 'invalid request url';
        }

        req.on('data', async (parameters) => {
            const isValidParameters = validateRequest({ parameters, reqUrl });

            if(isValidParameters) {
                const params = JSON.parse(parameters.toString());
                const data = await URLS[reqUrl].fn({ ...params });
                res.end(JSON.stringify(data));
            }

            return res.end(JSON.stringify(isValidParameters));
        })

    } catch (error) {
        res.end(JSON.stringify(error));
    }
}

const server = http.createServer((req, res) => routes(req, res));

server.listen(3000);

