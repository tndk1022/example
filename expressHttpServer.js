const expreess = require('express');
const app = expreess();

app.get('/', function(req, res) {
    res.send('Hello World - ksj');
});

app.get('/home', function(req, res) {
    res.send('home page - ksj');
});

app.get('/member', function(req, res) {
    res.send('member page - ksj');
});

app.listen(3000);