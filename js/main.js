let Caption = require('./caption');
let Drawer = require('./drawer');
let Mapper = require('./mapper');
let quotes = require('./quotes');

const DISPLAY_TIME = 11000;
const CAPTION_TIME = 3000;


let container = document.querySelector('.container');
let drawer = new Drawer(container);
let i = 0;
let timeout = 0;

function showCaption() {
    drawer.clear();
    let x = (Math.random() * 300 + 100) | 0;
    let y = (Math.random() * 300 + 100) | 0;
    let quote = quotes[i % quotes.length];
    let caption = new Caption(quote, x, y, drawer, container);
    caption.show().then(() => setTimeout(caption.hide.bind(caption), CAPTION_TIME));
    i++;
    timeout = setTimeout(showCaption, DISPLAY_TIME);
}

document.addEventListener('keydown', (e) => {
    if (e.which !== 32) { // SPACEBAR
        return;
    }
    if (timeout) {
        clearTimeout(timeout);
        timeout = 0;
    } else {
        showCaption();
    }
});

// showCaption();

let mapper = new Mapper(container);
window.mapper = mapper;
