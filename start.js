const { handler } = require('./dist/index');
const event = {
    queryStringParameters: {
        url: 'https://www.heise.de/select/ct/2019/18/1566917336782380'
    }
};
handler(event).then(r => console.log(r.body));