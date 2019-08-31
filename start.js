const { handler } = require('./dist/index');
const event = {
    queryStringParameters: {
        url: 'https://www.gruene.de/themen/digitalisierung',
        parser: 'mercury'
    }
};
handler(event).then(r => console.log(r.body));