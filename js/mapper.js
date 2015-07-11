let map = require('./world.json');

function ease(step, change, start) {
    return change * (1 - Math.pow(1 - step, 3)) + start;
}

class Mapper {
    constructor(container) {
        let winHeight = window.innerHeight;
        let winWidth = window.innerWidth;
        let canvas = document.createElement('canvas');
        canvas.style.height = `${winHeight}px`;
        canvas.style.width = `${winWidth}px`;
        canvas.height = winHeight * 2;
        canvas.width = winWidth * 2;
        container.appendChild(canvas);
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.json = map;
        this.ranges = this.getRange(map);
        this.draw();
    }

    draw() {
        let polygons = map.arcs;
        let {ctx} = this;
        let started = false;
        polygons.forEach(polygon => {
            ctx.beginPath();
            ctx.strokeStyle = '#444444';
            ctx.lineWidth = 1;
            let last;
            polygon.forEach(pt => {
                let [x, y] = pt;
                if (!started) {
                    ctx.moveTo(...this.mapPointToCanvas([x, y]));
                    last = [x, y];
                    started = true;
                } else {
                    x += last[0];
                    y += last[1];
                    ctx.lineTo(...this.mapPointToCanvas([x, y]));
                    last = [x, y];
                }
            });
            ctx.stroke();
            started = false;
            last = null;
        });
    }

    mapPointToCanvas(pt) {
        let {height, width} = this.canvas;
        let {x: xRange, y: yRange} = this.ranges;

        let xDiff = xRange[1] - xRange[0];
        let yDiff = yRange[1] - yRange[0];
        let [x, y] = pt;

        x -= xRange[0];
        y -= yRange[0];

        return [
            (x / xDiff) * width,
            (y / yDiff) * height
        ];
    }

    getRange(mapJSON) {
        let polygons = mapJSON.arcs;
        let max = [-Infinity, -Infinity];
        let min = [Infinity, Infinity];
        polygons.forEach(polygon => {
            let pt = polygon[0];
            if (pt[0] > max[0]) {
                max[0] = pt[0];
            }
            if (pt[1] > max[1]) {
                max[1] = pt[1];
            }
            if (pt[0] < min[0]) {
                min[0] = pt[0];
            }
            if (pt[1] < min[1]) {
                min[1] = pt[1];
            }
        });
        return {
            x: [min[0], max[0]],
            y: [min[1], max[1]]
        };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

module.exports = Mapper;
