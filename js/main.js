let Mapper = require('./mapper');
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

let scenes = [CountryScene, CaptionScene];
let i = 0;

function showScene() {
    let Scene = scenes[i % scenes.length];
    curScene = new Scene(container);
    curScene.start().then(() => {
        container.innerHTML = '';
        requestAnimationFrame(showScene);
    });
    i++;
}

requestAnimationFrame(showScene);
