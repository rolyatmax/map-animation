var fs = require('fs');
var path = require('path');
var http = require('http');
var codes = require('../js/country_codes.json');

var dataDir = path.join(process.cwd(), '..', 'data');
var fileTemplate = path.join(dataDir, '%s-all.geo.json');
var baseUrl = 'http://code.highcharts.com/mapdata/countries/%s/%s-all.geo.json';


if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

codes.forEach(function(code) {
    code = code.cca2.toLowerCase();
    var url = baseUrl.replace(/%s/g, code);
    console.log('Fetching from:', url);
    http.get(url, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            try {
                JSON.parse(body);
            } catch (err) {
                console.log('Skipping', url);
                return;
            }

            var filePath = fileTemplate.replace('%s', code);
            console.log('Writing to:', filePath);
            fs.writeFile(filePath, body, console.error.bind(console));
        });
        response.on('error', console.error.bind(console));
    }, console.error.bind(console));
});
