var fs = require('fs');
var path = require('path');
var https = require('https');
var Promise = require('promise-polyfill');
var codes = require('../js/country_codes_names.json');

var NUM_EXTRA_COUNTRIES = 5;

var geofreshBaseUrl = 'https://geofresh-api.buzzfeed.com';
var regionsEndpoint = '/regions';
var buzzesEndpoint = '/buzzes/%s';

var dataDir = path.join(process.cwd(), '..', 'data');
var filePath = path.join(dataDir, 'geofresh.json');

function main() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    getJSON(getUrl(regionsEndpoint))
        .then(fetchBuzzes)
        .then(writeFile)
        .then(function(file) {
            console.log('File written:', file);
        }, console.error.bind(console));
}

function getUrl(endpoint) {
    return geofreshBaseUrl + endpoint;
}

function getJSON(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, function(res) {
            var body = '';
            res.on('data', function(d) { body += d; });
            res.on('end', function() {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    console.warn('Not valid JSON from:', url, body);
                    reject(err);
                }
            });
        });
    });
}

function fetchBuzzes(regions) {
    // slice(1) so we don't include the "global" region
    regions = regions.slice(1);

    var j = NUM_EXTRA_COUNTRIES;
    while (j--) {
        var i = Math.random() * codes.length | 0;
        regions.push({
            'country_code': codes[i].code.toUpperCase(),
            'name': codes[i].name
        });
    }

    var promises = regions.map(function(region) {
        var url = getUrl(buzzesEndpoint.replace('%s', region['country_code'].toUpperCase()));
        return getJSON(url).then(function(buzzRes) {
            return {
                code: region['country_code'],
                name: region['name'],
                buzzes: buzzRes
            };
        });
    });
    return Promise.all(promises);
}

function writeFile(body) {
    var output = {
        timestamp: Date.now(),
        result: body
    };

    console.log('Writing to:', filePath);
    return new Promise(function(resolve, reject) {
        if (fs.existsSync(filePath)) {
            var archivedPath = filePath.replace('.json', '.' + Date.now() + '.json');
            fs.renameSync(filePath, archivedPath);
        }

        fs.writeFile(filePath, JSON.stringify(output), function(err) {
            if (err) {
                console.error('Error writing file ' + filePath, err);
                reject(err);
                return;
            }
            resolve(filePath);
        });
    });
}

main();
