let Mapper = require('./mapper');
let map = require('./world.json');
let CaptionScene = require('./caption_scene');
let CountryScene = require('./country_scene');

let worldMap = new Mapper(map);

let container = document.querySelector('.container');
let curScene;

document.addEventListener('keydown', (e) => {
    if (e.which !== 32) { // SPACEBAR
        return;
    }
    curScene.pause();
});

let scenes = [CountryScene, CaptionScene];
let i = 0;

function showScene() {
    let Scene = scenes[i % scenes.length];
    curScene = new Scene(container, worldMap);
    curScene.start().then(() => {
        container.innerHTML = '';
        requestAnimationFrame(showScene);
    });
    i++;
}

requestAnimationFrame(showScene);
