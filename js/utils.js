let countryCodes = require('./country_codes.json');

let onReady = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

let getThreeLetterCountryCode = (code) => {
    for (var i = 0, len = countryCodes.length; i < len; i++) {
        if (code === countryCodes[i]['cca2']) {
            return countryCodes[i]['cca3'];
        }
    }
    return null;
};

let getJSON = (url) => {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                try {
                    resolve(JSON.parse(this.response));
                } catch (err) {
                    reject(this.response);
                }
            } else {
                reject(this.response);
            }
        };
        request.onerror = function() {
            reject(this.response); // ?
        };
        request.send();
    });
};

export default {
    getThreeLetterCountryCode,
    onReady,
    getJSON
};
