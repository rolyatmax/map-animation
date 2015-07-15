let onReady = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

let getJSON = (url) => {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                resolve(JSON.parse(this.response));
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
    onReady,
    getJSON
};
