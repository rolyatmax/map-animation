let {easeOut, startAnimation} = require('utils');

const LETTER_ANIMATION = 2000;

class WordFade {
    constructor(text, container) {
        this.letterEls = [];
        this.textEl = this.buildElements(text);
        container.appendChild(this.textEl);
    }

    buildElements(text) {
        let wordEls = text.split(' ').map(word => {
            let wordEl = document.createElement('div');
            wordEl.classList.add('word');
            word.split('').forEach(letter => {
                let letterEl = document.createElement('span');
                letterEl.style.opacity = 0;
                letterEl.style.webkitTransform = 'rotate3d(104, 69, 32, 93deg)';
                letterEl.style.webkitTransition = `all ${LETTER_ANIMATION}ms ease`;
                letterEl.innerText = letter;
                this.letterEls.push(letterEl);
                wordEl.appendChild(letterEl);
            });
            return wordEl;
        });
        let textEl = document.createElement('div');
        textEl.classList.add('text');
        wordEls.forEach(textEl.appendChild.bind(textEl));
        return textEl;
    }

    showText(duration) {
        return this.animateText({
            'webkitTransform': 'rotate3d(0,0,0,0)',
            'opacity': 1
        }, duration);
    }

    hideText(duration) {
        return this.animateText({
            'webkitTransform': 'rotate3d(104, 69, 32, 93deg)',
            'opacity': 0
        }, duration);
    }

    animateText(props, duration) {
        duration -= LETTER_ANIMATION;
        let letters = this.letterEls.slice();
        let totalLetters = letters.length;
        return startAnimation(step => {
            step = Math.min(1, step);
            let lettersShouldBeLeft = totalLetters - (easeOut(step, 0, totalLetters) | 0);
            let lettersToAnimate = letters.length - lettersShouldBeLeft;
            if (lettersToAnimate) {
                while (lettersToAnimate--) {
                    let i = (Math.random() * letters.length) | 0;
                    let el = letters.splice(i, 1)[0];
                    for (let prop in props) {
                        if (prop in el.style) {
                            el.style[prop] = props[prop];
                        }
                    }
                }
            }
        }, duration).then(() => {
            return new Promise(resolve => setTimeout(resolve, LETTER_ANIMATION));
        });
    }

    clear() {
        this.textEl.parentElement.removeChild(this.textEl);
    }
}

module.exports = WordFade;
