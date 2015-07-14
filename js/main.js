let Caption = require('./caption');
let Drawer = require('./drawer');
let MapDrawer = require('./map_drawer');
let Mapper = require('./mapper');
let quotes = require('./quotes');
let map = require('./world.json');

const DISPLAY_TIME = 11000;
const CAPTION_TIME = 1000;
const NUM_QUOTES_TO_SHOW = 5;
const COLOR = '#444444';


let worldMap = new Mapper(map);
let container = document.querySelector('.container');
let timeout = 0;

document.addEventListener('keydown', (e) => {
    if (e.which !== 32) { // SPACEBAR
        return;
    }
    if (timeout) {
        clearTimeout(timeout);
        timeout = 0;
    }
});

function showScene() {
    let drawer = new Drawer(container);
    let quoteSelection = quotes.slice();
    let mapper = new MapDrawer(new Drawer(container), worldMap);

    function showCaptions(count, res) {
        return new Promise(resolve => {
            resolve = res || resolve;
            drawer.clear();

            let countryCodes = Object.keys(worldMap.countries);
            let i = (Math.random() * countryCodes.length) | 0;
            let code = countryCodes.splice(i, 1)[0];
            let {center} = worldMap.getCountryBoundingRect(code);
            center = mapper.mapPointToCanvas(center).map(x => x / 2); // divide by two because canvas pixels are doubled

            let j = (Math.random() * quoteSelection.length) | 0;
            let quote = quoteSelection.splice(j, 1)[0];
            let caption = new Caption(quote, center, drawer, container, COLOR);
            caption.show().then(() => setTimeout(caption.hide.bind(caption), CAPTION_TIME));
            count--;
            let next = count ? showCaptions.bind(null, count, resolve) : resolve;
            timeout = setTimeout(next, DISPLAY_TIME);
        });
    }

    mapper.show(9000, 3000, COLOR)
        .then(showCaptions.bind(null, NUM_QUOTES_TO_SHOW))
        .then(mapper.hide.bind(mapper))
        .then(() => {
            container.innerHTML = '';
            return Promise.resolve();
        }).then(() => requestAnimationFrame(showScene));

    window.mapper = mapper;
    window.drawer = drawer;
}

requestAnimationFrame(showScene);
