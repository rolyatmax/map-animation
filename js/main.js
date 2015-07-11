let Caption = require('./caption');
let Drawer = require('./drawer');
let quotes = require('./quotes');

const DISPLAY_TIME = 3 * 1000;

let container = document.querySelector('.container');
let drawer = new Drawer(container);
let i = 0;

function showCaption() {
    drawer.clear();
    let x = (Math.random() * 300 + 100) | 0;
    let y = (Math.random() * 300 + 100) | 0;
    let quote = quotes[i % quotes.length];
    let caption = new Caption(quote, x, y, drawer, container);
    caption.show().then(() => setTimeout(caption.hide.bind(caption), DISPLAY_TIME));
    i++;
    setTimeout(showCaption, DISPLAY_TIME * 3.7);
}

showCaption();
