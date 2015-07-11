let WordFade = require('./word_fade');


class Caption {
    constructor(text, originX, originY, drawer, container) {
        this.container = container;
        this.drawer = drawer;
        this.text = text;
        this.margin = 30;
        // this.origin = [originX, originY];
        this.origin = [100, 100];

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
            drawer.circle(origin[0], origin[1], radius, '#444444', 400, 2).then(() => {
                return drawer.line(lineStart[0], lineStart[1], lineStart[0], lineEnd[1], '#444444', 400);
            }).then(() => {
                fade.showText(4000).then(resolve);
                return drawer.line(lineStart[0], lineEnd[1], lineEnd[0], lineEnd[1], '#444444', 400);
            }).then(() => {
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] - halfLine, '#444444', 400);
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] + halfLine, '#444444', 400);
            });
        });
    }

    hide() {
        return new Promise((resolve) => {
            let {drawer, fade, origin, lineStart, lineEnd, radius, halfLine} = this;
            fade.hideText(4500).then(resolve);
            setTimeout(() => {
                drawer.circle(origin[0], origin[1], radius, '#ffffff', 1200, 4);
                drawer.line(lineStart[0], lineStart[1], lineStart[0], lineEnd[1], '#ffffff', 1200);
                drawer.line(lineStart[0], lineEnd[1], lineEnd[0], lineEnd[1], '#ffffff', 1200);
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] - halfLine, '#ffffff', 1200);
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] + halfLine, '#ffffff', 1200);
            }, 1900);
        });
    }
}

module.exports = Caption;
