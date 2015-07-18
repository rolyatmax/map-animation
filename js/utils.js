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

let startAnimation = (renderFn, duration) => {
    let startTime;
    return new Promise((resolve) => {
        function _render(t) {
            startTime = startTime || t;
            let step = (t - startTime) / duration;
            renderFn(step);
            if (step < 1) {
                requestAnimationFrame(_render);
            } else {
                resolve();
            }
        }
        requestAnimationFrame(_render);
    });
};

let easeOut = (step, start, change) => {
    return change * Math.pow(step, 2) + start;
};

let easeIn = (step, start, change) => {
    return change * (1 - Math.pow(1 - step, 3)) + start;
};

export default {
    getThreeLetterCountryCode,
    onReady,
    getJSON,
    startAnimation,
    easeOut,
    easeIn
};
