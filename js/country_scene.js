let {getJSON} = require('utils');
let {wait, rAF} = require('./helpers');
let WordFade = require('./word_fade');
let Drawer = require('drawer');
let MapDrawer = require('./map_drawer');
let Mapper = require('./mapper');

const DISPLAY_TIME = 5000;
const COLOR = '#444444';
const NUM_COUNTRIES_TO_SHOW = 2;

let map;

class CountryScene {
    constructor(container, data) {
        this.data = data.slice();
        this.container = container;
        this.timeout = 0;

        this.mapDrawer = null;

        window.mapper = this.mapDrawer;
        window.drawer = this.drawer;
    }

    start() {
        return this.showCountries(NUM_COUNTRIES_TO_SHOW);
    }

    showCountries(count, res) {
        return new Promise(resolve => {
            resolve = res || resolve;

            let i = Math.random() * this.data.length | 0;
            let {name, code} = this.data.splice(i, 1)[0];

            getJSON(`data/${code.toLowerCase()}-all.topo.json`).then(json => {
                map = new Mapper(json);

                this.drawer = new Drawer(this.container);
                this.mapDrawer = new MapDrawer(this.drawer, map, 8000);

                this.fade = new WordFade(name, this.container);
                this.fade.textEl.style.fontSize = '28px';
                this.fade.textEl.style.zIndex = 10;
                this.fade.textEl.style.left = '100px';
                this.fade.textEl.style.top = '100px';
                this.fade.showText(6000)
                    .then(() => wait(4000))
                    .then(() => this.fade.hideText(4000));

                count--;
                rAF()
                    .then(() => this.mapDrawer.show(500, 4000, COLOR))
                    .then(() => wait(DISPLAY_TIME))
                    .then(() => this.mapDrawer.hide())
                    .then(() => count ? this.showCountries(count, resolve) : resolve());
            }, this.showCountries.bind(this, count, resolve));
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
