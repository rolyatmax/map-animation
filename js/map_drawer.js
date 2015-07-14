function ease(step, change, start) {
    return change * Math.pow(step, 2) + start;
}


class MapDrawer {
    // expects `map` to be on object with ranges, arcs, (and optionally) a
    // countries key
    constructor(drawer, map, fadeSpeed) {
        drawer.canvas.style.opacity = 0.3;
        drawer.canvas.style.webkitTransform = 'rotate3d(9,9,0,75deg) scale(4, 4)';
        drawer.canvas.style.webkitTransition = `all ${fadeSpeed}ms ease`;
        this.drawer = drawer;
        this.map = map;
    }

    animateIn() {
        requestAnimationFrame(() => {
            this.drawer.canvas.style.opacity = 0.5;
            this.drawer.canvas.style.webkitTransform = 'rotate3d(0,0,0,0) scale(1, 1)';
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
        let startTime;
        let {drawer} = this;
        let transform = this.mapPointToCanvas.bind(this);
        return new Promise(resolve => {
            function drawSection(t) {
                startTime = startTime || t;
                let step = Math.min(1, (t - startTime) / duration);
                let arcsShouldBeLeft = totalArcs - (ease(step, totalArcs, 0) | 0);
                let arcsToDraw = arcs.length - arcsShouldBeLeft;
                if (arcsToDraw) {
                    while (arcsToDraw--) {
                        let i = (Math.random() * arcs.length) | 0;
                        let arc = arcs.splice(i, 1)[0];
                        drawer.arc(arc, drawSpeed, transform, color, width);
                    }
                }
                if (arcs.length) {
                    requestAnimationFrame(drawSection.bind(this));
                } else {
                    setTimeout(resolve, drawSpeed);
                }
            }
            requestAnimationFrame(drawSection.bind(this));
        });
    }

    // same as draw but draws individual countries
    drawCountries(duration, drawSpeed, color, width = 1) {
        let {drawer, map} = this;
        let countryCodes = Object.keys(map.countries);
        let totalCountries = countryCodes.length;
        let startTime;
        let transform = this.mapPointToCanvas.bind(this);
        return new Promise(resolve => {
            function drawSection(t) {
                startTime = startTime || t;
                let step = Math.min(1, (t - startTime) / duration);
                let countriesShouldBeLeft = totalCountries - (ease(step, totalCountries, 0) | 0);
                let countriesToDraw = countryCodes.length - countriesShouldBeLeft;
                if (countriesToDraw) {
                    while (countriesToDraw--) {
                        let i = (Math.random() * countryCodes.length) | 0;
                        let code = countryCodes.splice(i, 1)[0];
                        map.countries[code].forEach(arc => drawer.arc(arc, drawSpeed, transform, color, width));
                    }
                }
                if (countryCodes.length) {
                    requestAnimationFrame(drawSection.bind(this));
                } else {
                    setTimeout(resolve, drawSpeed);
                }
            }
            requestAnimationFrame(drawSection.bind(this));
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
        let {x: xRange, y: yRange} = this.map.ranges;

        let xDiff = xRange[1] - xRange[0];
        let yDiff = yRange[1] - yRange[0];
        let [x, y] = pt;

        x -= xRange[0];
        y -= yRange[0];

        return [
            (x / xDiff) * width,
            height - (y / yDiff) * height
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
