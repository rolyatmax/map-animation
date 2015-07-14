let map = require('./world.json');

const FADE_SPEED = 9000;

function ease(step, change, start) {
    return change * Math.pow(step, 2) + start;
}


class Mapper {
    constructor(drawer) {
        drawer.canvas.style.opacity = 0.3;
        drawer.canvas.style.webkitTransform = 'rotate3d(9,9,0,75deg) scale(4, 4)';
        drawer.canvas.style.webkitTransition = `all ${FADE_SPEED}ms ease`;
        this.drawer = drawer;
        this.json = map;
        this.arcs = this.convertArcsToAbsolute(map.arcs);
        this.countries = this.buildCountryShapes(map);
        this.ranges = this.getRange(this.arcs);
    }

    show(duration, drawSpeed, color) {
        requestAnimationFrame(() => {
            this.drawer.canvas.style.opacity = 0.5;
            this.drawer.canvas.style.webkitTransform = 'rotate3d(0,0,0,0) scale(1, 1)';
        });
        return this.drawCountries(duration, drawSpeed, color);
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

    // same as draw but draws individual countries
    drawCountries(duration, drawSpeed, color, width = 1) {
        let countryCodes = Object.keys(this.countries);
        let totalCountries = countryCodes.length;
        let startTime;
        let {drawer, countries} = this;
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
                        countries[code].forEach(arc => drawer.arc(arc, drawSpeed, transform, color, width));
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

    getCountryBoundingRect(country) {
        let {x: [minX, maxX], y: [minY, maxY]} = this.getRange(this.countries[country]);
        let width = maxX - minX;
        let height = maxY - minY;
        return {
            top: minY,
            left: minX,
            height: height,
            width: width,
            center: [minX + width / 2, minY + height / 2]
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

    buildCountryShapes(topoJSON) {
        let countries = {};
        let arcs = this.arcs;
        topoJSON.objects.countries.geometries.forEach(country => {
            let shapes = country.arcs.map(shape => {
                // if its a MultiPolygon, expect arrays inside arrays
                if (Array.isArray(shape[0])) {
                    shape = shape[0];
                }
                return shape.reduce((countryArc, arcIndex) => {
                    let arc;
                    if (arcIndex >= 0) {
                        arc = arcs[arcIndex].slice();
                    } else {
                        arc = arcs[~arcIndex].slice().reverse();
                    }
                    if (!countryArc.length) {
                        countryArc[0] = arc[0];
                    }
                    return countryArc.concat(arc.slice(1));
                }, []);
            });
            countries[country.properties.id] = shapes;
        });
        return countries;
    }

    hide() {
        requestAnimationFrame(() => this.drawer.canvas.style.opacity = 0);
        return this.draw(2000, 1500, '#ffffff', 3).then(this.clear.bind(this));
    }

    clear() {
        this.drawer.clear();
    }
}

module.exports = Mapper;
