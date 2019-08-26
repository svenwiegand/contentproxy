const { handler } = require('./dist/index');
const event = {
    queryStringParameters: {
        url: 'https://www.heise.de/select/ct/2019/18/1566918405928115',
        cookie: 'ssohls=s.U2FsdGVkX1-G00vyiU0oLocp8zAt8Qzp12vsPgqOKGLQ98XjWsM9xLfiZ5ZPGt_rwPa8UpihG6bX9ui4Z8CMpw'
    }
};
handler(event).then(r => console.log(r.body));