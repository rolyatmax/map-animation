let WordFade = require('./word_fade');


class Caption {
    constructor(text, origin, drawer, container, color) {
        this.container = container;
        this.drawer = drawer;
        this.text = text;
        this.margin = 30;
        this.origin = origin;
        this.color = color;
        let [originX, originY] = origin;

        this.fade = new WordFade(text, container);
        let styles = window.getComputedStyle(this.fade.textEl);
        let height = parseInt(styles.height, 10);
        let width = parseInt(styles.width, 10);
        let top = (Math.random() * (window.innerHeight - height - originY - this.margin) + originY) | 0;
        let left = (Math.random() * (window.innerWidth - width - originX - this.margin) + originX) | 0;
        this.fade.textEl.style.top = `${top}px`;
        this.fade.textEl.style.left = `${left}px`;
        this.fade.textEl.style.zIndex = 10;

        this.textBg = document.createElement('div');
        this.textBg.style.top = `${top - this.margin}px`;
        this.textBg.style.left = `${left - this.margin + 2}px`;
        this.textBg.style.width = `${width + this.margin * 2}px`;
        this.textBg.style.height = `${height + this.margin * 2}px`;
        this.textBg.style.backgroundColor = '#ffffff';
        this.textBg.style.position = 'absolute';
        this.textBg.style.webkitTransform = 'scale(0.6, 0.6)';
        this.textBg.style.webkitTransition = 'all 5000ms ease';
        this.textBg.style.opacity = 0;
        this.textBg.style.zIndex = 2;
        this.container.appendChild(this.textBg);

        this.radius = 20;
        this.lineStart = [this.origin[0], this.origin[1] + this.radius];
        this.lineEnd = [left - this.margin, top + height / 2];
        this.halfLine = this.margin + height / 2;
    }

    show() {
        return new Promise((resolve) => {
            let {drawer, fade, origin, lineStart, lineEnd, radius, halfLine, textBg, color} = this;
            drawer.circle(origin[0], origin[1], radius, color, 400, 2).then(() => {
                return drawer.line(lineStart[0], lineStart[1], lineStart[0], lineEnd[1], color, 400);
            }).then(() => {
                fade.showText(4000).then(resolve);
                textBg.style.opacity = 0.85;
                textBg.style.webkitTransform = 'scale(1,1)';
                return drawer.line(lineStart[0], lineEnd[1], lineEnd[0], lineEnd[1], color, 400);
            }).then(() => {
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] - halfLine, color, 400);
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] + halfLine, color, 400);
            });
        });
    }

    hide() {
        return new Promise((resolve) => {
            let {drawer, fade, origin, lineStart, lineEnd, radius, halfLine, textBg} = this;
            let color = '#ffffff';
            fade.hideText(4500).then(resolve);
            textBg.style.opacity = 0;
            textBg.style.webkitTransform = 'scale(0.6,0.6)';
            setTimeout(() => {
                drawer.circle(origin[0], origin[1], radius, color, 1200, 4);
                drawer.line(lineStart[0], lineStart[1], lineStart[0], lineEnd[1], color, 1200);
                drawer.line(lineStart[0], lineEnd[1], lineEnd[0], lineEnd[1], color, 1200);
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] - halfLine, color, 1200);
                drawer.line(lineEnd[0], lineEnd[1], lineEnd[0], lineEnd[1] + halfLine, color, 1200);
            }, 1900);
        });
    }
}

module.exports = Caption;
