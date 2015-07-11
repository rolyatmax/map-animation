const LETTER_ANIMATION = 2000;

function ease(step, change, start) {
    return change * Math.pow(step, 2) + start;
}

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
                letterEl.style.webkitTransform = `rotate3d(104, 69, 32, 93deg)`;
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
        duration -= LETTER_ANIMATION;
        let letters = this.letterEls.slice();
        let totalLetters = letters.length;
        let startTime;
        return new Promise((resolve) => {
            function revealLetter(t) {
                startTime = startTime || t;
                let step = Math.min(1, (t - startTime) / duration);
                let lettersShouldBeLeft = totalLetters - (ease(step, totalLetters, 0) | 0);
                let lettersToAnimate = letters.length - lettersShouldBeLeft;
                if (lettersToAnimate) {
                    while (lettersToAnimate--) {
                        let i = (Math.random() * letters.length) | 0;
                        let el = letters.splice(i, 1)[0];
                        el.style.opacity = 1;
                        el.style.webkitTransform = 'rotate3d(0,0,0,0)';
                    }
                }
                if (letters.length) {
                    requestAnimationFrame(revealLetter);
                } else {
                    setTimeout(resolve, LETTER_ANIMATION);
                }
            }
            requestAnimationFrame(revealLetter);
        });
    }

    hideText(duration) {
        duration -= LETTER_ANIMATION;
        let {letterEls, textEl} = this;
        let letters = letterEls.slice();
        let totalLetters = letters.length;
        let startTime;
        return new Promise((resolve) => {
            function hideLetter(t) {
                startTime = startTime || t;
                let step = Math.min(1, (t - startTime) / duration);
                let lettersShouldBeLeft = totalLetters - (ease(step, totalLetters, 0) | 0);
                let lettersToAnimate = letters.length - lettersShouldBeLeft;
                if (lettersToAnimate) {
                    while (lettersToAnimate--) {
                        let i = (Math.random() * letters.length) | 0;
                        let el = letters.splice(i, 1)[0];
                        el.style.webkitTransform = `rotate3d(104, 69, 32, 93deg)`;
                        el.style.opacity = 0;
                    }
                }
                if (letters.length) {
                    requestAnimationFrame(hideLetter);
                } else {
                    setTimeout(() => {
                        textEl.parentElement.removeChild(textEl);
                        resolve();
                    }, LETTER_ANIMATION);
                }
            }
            requestAnimationFrame(hideLetter);
        });
    }

    clear() {
        this.textEl.parentElement.removeChild(this.textEl);
    }
}

module.exports = WordFade;
