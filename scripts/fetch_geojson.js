// NOTE: this script requires the topojson command line tool which is installed
// by running npm install in the root of this repo

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var http = require('http');
var codes = require('../js/country_codes.json');

var dataDir = path.join(process.cwd(), '..', 'data');
var fileTemplate = path.join(dataDir, '%s-all.geo.json');
var topojsonBinPath = path.join(process.cwd(), '..', 'node_modules/.bin/topojson');
var baseUrl = 'http://code.highcharts.com/mapdata/countries/%s/%s-all.geo.json';

var total = 0;

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

codes.forEach(function(code) {
    code = code.cca2.toLowerCase();
    var filePath = fileTemplate.replace('%s', code);
    if (fs.existsSync(filePath)) {
        if (!fs.existsSync(filePath.replace('.geo.', '.topo.'))) {
            convertToTopo(filePath);
        }
        return;
    }

    var url = baseUrl.replace(/%s/g, code);
    console.log('Fetching from:', url);
    http.get(url, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            writeFile(body, url, filePath);
        });
        response.on('error', console.error.bind(console));
    }, console.error.bind(console));
});

function writeFile(body, url, filePath) {
    try {
        JSON.parse(body);
    } catch (err) {
        console.log('Skipping', url);
        return;
    }
    total += 1;
    console.log('Writing file #%d to:'.replace('%d', total), filePath);
    fs.writeFile(filePath, body, function(err) {
        if (err) {
            return console.error('Error writing file ' + filePath, err);
        }
        convertToTopo(filePath);
    });
}

function convertToTopo(filePath) {
    var topoPath = filePath.replace('.geo.', '.topo.');
    var cmd = topojsonBinPath + ' ' + filePath + ' > ' + topoPath;
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            console.error('topojson error:', error);
        }
        if (stdout) {
            console.log('topojson result:', stdout);
        }
        if (stderr) {
            console.error('topojson error:', stderr);
        }
    });
}
