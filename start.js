const {handler} = require('./dist/index');
const event = {
    name: 'testevent'
};
handler(event).then(r => console.log(r));