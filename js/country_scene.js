let Drawer = require('./drawer');
let MapDrawer = require('./map_drawer');

const DISPLAY_TIME = 5000;
const COLOR = '#444444';
const NUM_COUNTRIES_TO_SHOW = 1;

class CountryScene {
    constructor(container, worldMap) {
        this.container = container;
        this.timeout = 0;

        this.mapDrawer = null;
        this.worldMap = worldMap;

        window.mapper = this.mapDrawer;
        window.drawer = this.drawer;
    }

    start() {
        return this.showCountries(NUM_COUNTRIES_TO_SHOW);
    }

    showCountries(count, res) {
        return new Promise(resolve => {
            resolve = res || resolve;

            let countryCodes = Object.keys(this.worldMap.countries);
            let i = (Math.random() * countryCodes.length) | 0;
            // let code = countryCodes.splice(i, 1)[0];
            let code = 'USA';
            let arcs = this.worldMap.countries[code];

            let map = {
                arcs: arcs,
                ranges: this.worldMap.getRange(arcs)
            };

            this.drawer = new Drawer(this.container);
            this.mapDrawer = new MapDrawer(this.drawer, map, 8000);

            count--;
            let next = count ? this.showCountries.bind(this, count, resolve) : resolve;
            requestAnimationFrame(() => {
                this.mapDrawer.show(500, 4000, COLOR).then(() => {
                    this.timeout = setTimeout(() => {
                        this.mapDrawer.hide().then(next);
                    }, DISPLAY_TIME);
                });
            });
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

module.exports = CountryScene;
