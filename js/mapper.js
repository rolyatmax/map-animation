let map = require('./world.json');

const FADE_SPEED = 3000;

function ease(step, change, start) {
    return change * Math.pow(step, 2) + start;
}


class Mapper {
    constructor(drawer) {
        drawer.canvas.style.opacity = 0;
        drawer.canvas.style.webkitTransition = `all ${FADE_SPEED}ms linear`;
        this.drawer = drawer;
        this.json = map;
        this.arcs = this.convertArcsToAbsolute(map.arcs);
        this.ranges = this.getRange(this.arcs);
    }

    draw(duration, drawSpeed, color, width = 1) {
        let arcs = this.arcs.slice();
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
        let {x: xRange, y: yRange} = this.ranges;

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

    getRange(arcs) {
        let max = [-Infinity, -Infinity];
        let min = [Infinity, Infinity];
        arcs.forEach(arc => {
            arc.forEach(pt => {
                let [x, y] = pt;
                let [maxX, maxY] = max;
                let [minX, minY] = min;
                if (x > maxX) {
                    max[0] = x;
                }
                if (y > maxY) {
                    max[1] = y;
                }
                if (x < minX) {
                    min[0] = x;
                }
                if (y < minY) {
                    min[1] = y;
                }
            });
        });
        return {
            x: [min[0], max[0]],
            y: [min[1], max[1]]
        };
    }

    convertArcsToAbsolute(arcs) {
        return arcs.map(arc => {
            let last;
            return arc.map(pt => {
                let absolutePt;
                if (!last) {
                    absolutePt = pt;
                } else {
                    let [lastX, lastY] = last;
                    let [x, y] = pt;
                    absolutePt = [lastX + x, lastY + y];
                }
                last = absolutePt;
                return absolutePt;
            });
        });
    }

    hide() {
        requestAnimationFrame(() => this.drawer.canvas.style.opacity = 0);
        this.draw(2000, 500, '#ffffff', 3).then(this.clear.bind(this));
    }

    clear() {
        this.drawer.clear();
    }
}

module.exports = Mapper;
