const { handler } = require('./dist/index');
const event = {
    queryStringParameters: {
        url: 'https://wikipedia.de/'
    }
};
handler(event).then(r => console.log(r));