let WordFade = require('./word_fade');


class Caption {
    constructor(text, originX, originY, drawer, container) {
        this.container = container;
        this.drawer = drawer;
        this.text = text;
        this.margin = 30;
        this.origin = [originX, originY];

        this.fade = new WordFade(text, container);
        let styles = window.getComputedStyle(this.fade.textEl);
        let height = parseInt(styles.height, 10);
        let width = parseInt(styles.width, 10);
        let top = (Math.random() * (window.innerHeight - height - originY - this.margin) + originY) | 0;
        let left = (Math.random() * (window.innerWidth - width - originX - this.margin) + originX) | 0;
        this.fade.textEl.style.top = `${top}px`;
        this.fade.textEl.style.left = `${left}px`;

        this.radius = 20;
        this.lineStart = [this.origin[0], this.origin[1] + this.radius];
        this.lineEnd = [left - this.margin, top + height / 2];
        this.halfLine = this.margin + height / 2;
    }

    show() {
        return new Promise((resolve) => {
            let {drawer, fade, origin, lineStart, lineEnd, radius, halfLine} = this;
            drawer.circle(origin[0], origin[1], radius, '#444444', 0.2, 2).then(() => {
                return drawer.line(lineStart[0], lineStart[1], lineStart[0], lineEnd[1], '#444444', 0.15);
            }).then(() => {
                return drawer.line(lineStart[0], lineEnd[1], lineEnd[0], lineEnd[1], '#444444', 0.15);
            }).then(() => {
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] - halfLine, '#444444', 0.08);
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] + halfLine, '#444444', 0.08);
                return fade.showText();
            }).then(resolve);
        });
    }

    hide() {
        return new Promise((resolve) => {
            let {drawer, fade, origin, lineStart, lineEnd, radius, halfLine} = this;
            drawer.circle(origin[0], origin[1], radius, '#ffffff', 0.2, 4);
            drawer.line(lineStart[0], lineStart[1], lineStart[0], lineEnd[1], '#ffffff', 0.15);
            drawer.line(lineStart[0], lineEnd[1], lineEnd[0], lineEnd[1], '#ffffff', 0.15);
            drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] - halfLine, '#ffffff', 0.08);
            drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] + halfLine, '#ffffff', 0.08);
            fade.hideText().then(resolve);
        });
    }
}

module.exports = Caption;
