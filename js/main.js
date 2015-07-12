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

function showCaptions(count, res) {
    return new Promise(resolve => {
        resolve = res || resolve;
        drawer.clear();
        let x = (Math.random() * 300 + 100) | 0;
        let y = (Math.random() * 300 + 100) | 0;
        let quote = quotes[i % quotes.length];
        let caption = new Caption(quote, x, y, drawer, container);
        caption.show().then(() => setTimeout(caption.hide.bind(caption), CAPTION_TIME));
        i++;
        count--;
        let next = count ? showCaptions.bind(null, count, resolve) : resolve;
        timeout = setTimeout(next, DISPLAY_TIME);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.which !== 32) { // SPACEBAR
        return;
    }
    if (timeout) {
        clearTimeout(timeout);
        timeout = 0;
    }
});

let mapDrawer = new Drawer(container);
let mapper = new Mapper(mapDrawer);
requestAnimationFrame(() => mapper.drawer.canvas.style.opacity = 0.5);
mapper.draw(2000, 2000, '#444444').then(showCaptions.bind(null, 1)).then(mapper.hide.bind(mapper));

window.mapper = mapper;
window.drawer = drawer;
