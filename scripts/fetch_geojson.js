// NOTE: this script requires the topojson command line tool which is installed
// by running npm install in the root of this repo

'use strict';

let fs = require('fs');
let path = require('path');
let exec = require('child_process').exec;
let http = require('http');
let codes = require('../js/country_codes.json');

let dataDir = path.join(process.cwd(), '..', 'data');
let fileTemplate = path.join(dataDir, '%s-all.geo.json');
let baseUrl = 'http://code.highcharts.com/mapdata/countries/%s/%s-all.geo.json';

let total = 0;

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

codes.forEach(function(code) {
    code = code.cca2.toLowerCase();
    let filePath = fileTemplate.replace('%s', code);
    if (fs.existsSync(filePath)) {
        if (!fs.existsSync(filePath.replace('.geo.', '.topo.'))) {
            convertToTopo(filePath);
        }
        return;
    }

    let url = baseUrl.replace(/%s/g, code);
    console.log('Fetching from:', url);
    http.get(url, function(response) {
        let body = '';
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
    console.log(`Writing file #${total} to:`, filePath);
    fs.writeFile(filePath, body, function(err) {
        if (err) {
            return console.error(`Error writing file ${filePath}:`, err);
        }
        convertToTopo(filePath);
    });
}

function convertToTopo(filePath) {
    let cmd = `../node_modules/.bin/topojson ${filePath} > ${filePath.replace('.geo.', '.topo.')}`;
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
