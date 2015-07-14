class Mapper {
    constructor(map) {
        this.json = map;
        this.arcs = this.convertArcsToAbsolute(map.arcs);
        this.countries = this.buildCountryShapes(map);
        this.ranges = this.getRange(this.arcs);
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
}

module.exports = Mapper;
