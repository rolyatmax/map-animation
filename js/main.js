let {getJSON} = require('utils');
let {rAF} = require('./helpers');
let CaptionScene = require('./caption_scene');
let CountryScene = require('./country_scene');

let container = document.querySelector('.container');
let curScene;

document.addEventListener('keydown', (e) => {
    if (e.which !== 32) { // SPACEBAR
        return;
    }
    curScene.pause();
});

let scenes = [CaptionScene, CountryScene];
let i = 0;

function main() {
    getJSON('data/geofresh.json').then(data => {
        function showScene() {
            let Scene = scenes[i % scenes.length];
            curScene = new Scene(container, data.result);
            curScene.start()
                .then(() => container.innerHTML = '')
                .then(rAF)
                .then(showScene);
            i++;
        }
        requestAnimationFrame(showScene);
    });
}

main();
