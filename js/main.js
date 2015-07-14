let CaptionScene = require('./caption_scene');
let Mapper = require('./mapper');
let map = require('./world.json');

let worldMap = new Mapper(map);

let container = document.querySelector('.container');
let curScene;

document.addEventListener('keydown', (e) => {
    if (e.which !== 32) { // SPACEBAR
        return;
    }
    curScene.pause();
});

function showScene() {
    curScene = new CaptionScene(container, worldMap);
    curScene.start().then(() => {
        container.innerHTML = '';
        requestAnimationFrame(showScene);
    });
}

requestAnimationFrame(showScene);
