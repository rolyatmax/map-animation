let Caption = require('./caption');
let Drawer = require('./drawer');
let MapDrawer = require('./map_drawer');
let quotes = require('./quotes');

const DISPLAY_TIME = 11000;
const CAPTION_TIME = 1000;
const NUM_QUOTES_TO_SHOW = 5;
const COLOR = '#444444';


class CaptionScene {
    constructor(container, worldMap) {
        this.container = container;
        this.timeout = 0;

        this.drawer = new Drawer(container);
        this.quoteSelection = quotes.slice();
        this.mapper = new MapDrawer(new Drawer(container), worldMap);
        this.worldMap = worldMap;

        window.mapper = this.mapper;
        window.drawer = this.drawer;
    }

    start() {
        return this.mapper.show(9000, 3000, COLOR)
            .then(this.showCaptions.bind(this, NUM_QUOTES_TO_SHOW))
            .then(this.teardown.bind(this));
    }

    showCaptions(count, res) {
        return new Promise(resolve => {
            resolve = res || resolve;
            this.drawer.clear();

            let countryCodes = Object.keys(this.worldMap.countries);
            let i = (Math.random() * countryCodes.length) | 0;
            let code = countryCodes.splice(i, 1)[0];
            let {center} = this.worldMap.getCountryBoundingRect(code);
            // divide by two because canvas pixels are doubled
            center = this.mapper.mapPointToCanvas(center).map(x => x / 2);

            let j = (Math.random() * this.quoteSelection.length) | 0;
            let quote = this.quoteSelection.splice(j, 1)[0];
            let caption = new Caption(quote, center, this.drawer, this.container, COLOR);
            caption.show().then(() => setTimeout(caption.hide.bind(caption), CAPTION_TIME));
            count--;
            let next = count ? this.showCaptions.bind(this, count, resolve) : resolve;
            this.timeout = setTimeout(next, DISPLAY_TIME);
        });
    }

    teardown() {
        return this.mapper.hide();
    }

    pause() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = 0;
        }
    }
}

module.exports = CaptionScene;
