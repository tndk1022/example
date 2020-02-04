var request = require('request');
var parseString = require('xml2js').parseString;
request('http://www.naver.com', function(error, response, body) {
    /*console.log('error',error);
    console.log('statusCode: ', response&&response.statusCode);
    console.log('body', body);*/
    parseString(body, function(err, result) {
        console.log(result.rss);
    });
} );