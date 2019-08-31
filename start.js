const { handler } = require('./dist/index');
const event = {
    queryStringParameters: {
        url: 'https://www.gruene.de/themen/digitalisierung',
        //url: 'https://epaper.zeit.de/article/bf397a9d07bfaf9d17b4939773dfc96b8f39585143ca74fb5ea035dfccff22a9',
        parser: 'mercury'
    }
};
handler(event).then(r => console.log(r.body));