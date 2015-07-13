let WordFade = require('./word_fade');


class Caption {
    constructor(text, origin, drawer, container, color) {
        this.container = container;
        this.drawer = drawer;
        this.text = text;
        this.margin = 100;
        this.padding = 30;
        this.origin = origin;
        this.color = color;
        this.radius = 20;

        this.fade = new WordFade(text, container);
        this.fade.textEl.style.zIndex = 10;

        this.textBg = document.createElement('div');
        this.textBg.classList.add('text-bg');
        this.textBg.style.opacity = 0;
        this.textBg.style.webkitTransform = 'scale(0.6, 0.6)';
        this.container.appendChild(this.textBg);

        this.setPositions(origin);
    }

    // position the box based on the origin (in the opposite quadrant)
    setPositions(origin) {
        let {height: textElHeight, width: textElWidth} = this.fade.textEl.getBoundingClientRect();
        let {height: canvasHeight, width: canvasWidth} = this.drawer.canvas.getBoundingClientRect();

        // this is probably better called padding (and should be managed by the css)
        textElHeight += this.padding * 2;
        textElWidth += this.padding * 2;

        let {
            inTopHalf: originInTopHalf,
            inLeftHalf: originInLeftHalf
        } = this.getQuadrant(origin, canvasHeight, canvasWidth);

        let top = originInTopHalf ? canvasHeight - textElHeight - this.margin : this.margin; // padding + margin
        let left = originInLeftHalf ? canvasWidth - textElWidth - this.margin : this.margin; // padding + margin

        this.fade.textEl.style.left = `${left + this.padding}px`;
        this.fade.textEl.style.top = `${top + this.padding}px`;
        this.fade.textEl.style.textAlign = originInLeftHalf ? 'left' : 'right';

        this.textBg.style.height = `${textElHeight}px`;
        this.textBg.style.width = `${textElWidth}px`;
        this.textBg.style.left = `${left}px`;
        this.textBg.style.top = `${top}px`;

        // these should be set based on quadrant
        let lineLeftEnd = originInLeftHalf ? left - 2 : left + textElWidth + 2;
        this.halfLine = textElHeight / 2;
        this.lineEnd = [lineLeftEnd, top + this.halfLine];
        this.startAngle = originInTopHalf ? 0.5 : 1.5;
        let lineStartOffset = originInTopHalf ? this.radius : -this.radius;
        this.lineStart = [origin[0], origin[1] + lineStartOffset];
    }

    getQuadrant([x, y], height, width) {
        return {
            'inTopHalf': y <= height / 2,
            'inLeftHalf': x <= width / 2
        };
    }

    show() {
        let {drawer, fade, origin, lineStart, lineEnd, radius, halfLine, textBg, color} = this;
        return new Promise((resolve) => {
            drawer.circle(origin, radius, this.startAngle, color, 400, 2).then(() => {
                return drawer.line(lineStart, [lineStart[0], lineEnd[1]], color, 400);
            }).then(() => {
                fade.showText(4000).then(resolve);
                textBg.style.opacity = 0.85;
                textBg.style.webkitTransform = 'scale(1,1)';
                return drawer.line([lineStart[0], lineEnd[1]], lineEnd, color, 400);
            }).then(() => {
                drawer.line(lineEnd, [lineEnd[0], lineEnd[1] - halfLine], color, 400);
                drawer.line(lineEnd, [lineEnd[0], lineEnd[1] + halfLine], color, 400);
            });
        });
    }

    hide() {
        let {drawer, fade, origin, lineStart, lineEnd, radius, halfLine, textBg} = this;
        let color = '#ffffff';
        return new Promise((resolve) => {
            fade.hideText(4500).then(resolve);
            textBg.style.opacity = 0;
            textBg.style.webkitTransform = 'scale(0.6,0.6)';
            setTimeout(() => {
                drawer.circle(origin, radius, this.startAngle, color, 1200, 4);
                drawer.line(lineStart, [lineStart[0], lineEnd[1]], color, 1200);
                drawer.line([lineStart[0], lineEnd[1]], lineEnd, color, 1200);
                drawer.line(lineEnd, [lineEnd[0], lineEnd[1] - halfLine], color, 1200);
                drawer.line(lineEnd, [lineEnd[0], lineEnd[1] + halfLine], color, 1200);
            }, 1900);
        });
    }
}

module.exports = Caption;
