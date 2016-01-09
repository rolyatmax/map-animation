let Caption = require('./caption');
let Drawer = require('drawer');
let MapDrawer = require('./map_drawer');
let Mapper = require('./mapper');
let map = require('./world.json');
let countryCodes = require('./country_codes.json');

let worldMap = new Mapper(map);

const DISPLAY_TIME = 11000;
const CAPTION_TIME = 1000;
const NUM_QUOTES_TO_SHOW = 3;
const COLOR = '#444444';


function getThreeLetterCountryCode(code) {
    for (let i = 0, len = countryCodes.length; i < len; i++) {
        if (code === countryCodes[i]['cca2']) {
            return countryCodes[i]['cca3'];
        }
    }
    return null;
}

class CaptionScene {
    constructor(container, data) {
        this.data = data.slice().filter(region => !!region.buzzes.length);
        this.container = container;
        this.timeout = 0;

        this.drawer = new Drawer(container);
        this.mapDrawer = new MapDrawer(new Drawer(container), worldMap, 9000);

        window.mapDrawer = this.mapDrawer;
        window.drawer = this.drawer;
    }

    start() {
        return this.mapDrawer.showCountries(9000, 3000, COLOR)
            .then(() => this.showCaptions(NUM_QUOTES_TO_SHOW))
            .then(() => this.teardown());
    }

    showCaptions(count, res) {
        return new Promise(resolve => {
            resolve = res || resolve;
            this.drawer.clear();

            let i = Math.random() * this.data.length | 0;
            let region = this.data.splice(i, 1)[0];
            let code = getThreeLetterCountryCode(region.code);

            // TODO: make sure this code is in worldMap

            let {center} = worldMap.getCountryBoundingRect(code);
            // divide by two because canvas pixels are doubled
            center = this.mapDrawer.mapPointToCanvas(center).map(x => x / 2);

            let j = (Math.random() * region.buzzes.length) | 0;
            let quote = region.buzzes[j].title;

            let caption = new Caption(quote, center, this.drawer, this.container, COLOR);
            caption.show().then(() => setTimeout(caption.hide.bind(caption), CAPTION_TIME));
            count--;
            let next = count ? this.showCaptions.bind(this, count, resolve) : resolve;
            this.timeout = setTimeout(next, DISPLAY_TIME);
        });
    }

    teardown() {
        return this.mapDrawer.hide();
    }

    pause() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = 0;
        }
    }
}

module.exports = CaptionScene;
