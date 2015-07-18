let {startAnimation, easeOut} = require('./utils');

class MapDrawer {
    // expects `map` to be on object with ranges, arcs, (and optionally) a
    // countries key ??
    constructor(drawer, map, fadeSpeed) {
        drawer.canvas.style.opacity = 0.3;
        drawer.canvas.style.webkitTransform = 'rotate3d(9,9,0,75deg) scale(4, 4)';
        drawer.canvas.style.webkitTransition = `all ${fadeSpeed}ms ease`;
        this.fadeSpeed = fadeSpeed;
        this.drawer = drawer;
        this.map = map;
    }

    animateIn() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                this.drawer.canvas.style.opacity = 0.5;
                this.drawer.canvas.style.webkitTransform = 'rotate3d(0,0,0,0) scale(1, 1)';
            });
            setTimeout(resolve, this.fadeSpeed);
        });
    }

    show(duration, drawSpeed, color) {
        this.animateIn();
        return this.draw(duration, drawSpeed, color);
    }

    showCountries(duration, drawSpeed, color) {
        this.animateIn();
        return this.drawCountries(duration, drawSpeed, color);
    }

    draw(duration, drawSpeed, color, width = 1) {
        let arcs = this.map.arcs.slice();
        let totalArcs = arcs.length;
        return startAnimation(step => {
            step = Math.min(1, step);
            let arcsShouldBeLeft = totalArcs - (easeOut(step, 0, totalArcs) | 0);
            let arcsToDraw = arcs.length - arcsShouldBeLeft;
            if (arcsToDraw) {
                while (arcsToDraw--) {
                    let i = (Math.random() * arcs.length) | 0;
                    let arc = arcs.splice(i, 1)[0];
                    this.drawer.arc(arc.map(this.mapPointToCanvas.bind(this)), drawSpeed, color, width);
                }
            }
        }, duration).then(() => {
            return new Promise(resolve => setTimeout(resolve, drawSpeed));
        });
    }

    // same as draw but draws individual countries
    drawCountries(duration, drawSpeed, color, width = 1) {
        let countryCodes = Object.keys(this.map.countries);
        let totalCountries = countryCodes.length;
        return startAnimation(step => {
            step = Math.min(1, step);
            let countriesShouldBeLeft = totalCountries - (easeOut(step, 0, totalCountries) | 0);
            let countriesToDraw = countryCodes.length - countriesShouldBeLeft;
            if (countriesToDraw) {
                while (countriesToDraw--) {
                    let i = (Math.random() * countryCodes.length) | 0;
                    let code = countryCodes.splice(i, 1)[0];
                    this.map.countries[code].forEach(arc => {
                        this.drawer.arc(arc.map(this.mapPointToCanvas.bind(this)), drawSpeed, color, width);
                    });
                }
            }
        }, duration).then(() => {
            return new Promise(resolve => setTimeout(resolve, drawSpeed));
        });
    }

    // draws arcs in topojson format
    drawRelativeArc(arc) {
        let {ctx} = this.drawer;
        ctx.beginPath();
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        let last;
        arc.forEach(pt => {
            let [x, y] = pt;
            if (!last) {
                ctx.moveTo(...this.mapPointToCanvas([x, y]));
            } else {
                x += last[0];
                y += last[1];
                ctx.lineTo(...this.mapPointToCanvas([x, y]));
            }
            last = [x, y];
        });
        ctx.stroke();
        last = null;
    }

    mapPointToCanvas(pt) {
        let {height, width} = this.drawer.canvas;
        let {x: [minX, maxX], y: [minY, maxY]} = this.map.ranges;

        let xDiff = maxX - minX;
        let yDiff = maxY - minY;
        let [x, y] = pt;

        let xScale = width / xDiff;
        let yScale = height / yDiff;
        let scale = xScale < yScale ? xScale : yScale;

        return [
            (x - minX) * scale,
            (maxY - y) * scale
        ];
    }

    hide() {
        requestAnimationFrame(() => this.drawer.canvas.style.opacity = 0);
        return this.draw(2000, 1500, '#ffffff', 3).then(this.clear.bind(this));
    }

    clear() {
        this.drawer.clear();
    }
}

module.exports = MapDrawer;
