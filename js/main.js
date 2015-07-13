let Caption = require('./caption');
let Drawer = require('./drawer');
let Mapper = require('./mapper');
let quotes = require('./quotes');

const DISPLAY_TIME = 11000;
const CAPTION_TIME = 3000;
const NUM_QUOTES_TO_SHOW = 2;
const COLOR = '#444444';


let container = document.querySelector('.container');
let drawer = new Drawer(container);
let timeout = 0;

function showCaptions(count, res) {
    return new Promise(resolve => {
        resolve = res || resolve;
        drawer.clear();
        let x = (Math.random() * 300 + 100) | 0;
        let y = (Math.random() * 300 + 100) | 0;
        let i = (Math.random() * quotes.length) | 0;
        let quote = quotes.splice(i, 1)[0];
        let caption = new Caption(quote, [x, y], drawer, container, COLOR);
        caption.show().then(() => setTimeout(caption.hide.bind(caption), CAPTION_TIME));
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
mapper.draw(20000, 2000, COLOR)
    .then(showCaptions.bind(null, NUM_QUOTES_TO_SHOW))
    .then(mapper.hide.bind(mapper));

window.mapper = mapper;
window.drawer = drawer;
