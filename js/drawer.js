const PI = Math.PI;
const ASPECT_RATIO = 3 / 7;

function ease(step, change, start) {
    return change * (1 - Math.pow(1 - step, 3)) + start;
}

function dist([x1, y1], [x2, y2]) {
    let xDist = x2 - x1;
    let yDist = y2 - y1;
    return Math.sqrt(xDist * xDist + yDist * yDist);
}

class Drawer {
    constructor(container) {
        let height = window.innerHeight;
        let width = window.innerWidth;
        height = width * ASPECT_RATIO;
        let canvas = document.createElement('canvas');
        canvas.style.height = `${height}px`;
        canvas.style.width = `${width}px`;
        canvas.height = height * 2;
        canvas.width = width * 2;
        container.appendChild(canvas);
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
    }

    circle(x, y, radius, color, duration, width = 1) {
        x *= 2;
        y *= 2;
        radius *= 2;
        let startAngle = 0.5;
        let ctx = this.ctx;
        let startTime;
        return new Promise((resolve) => {
            function render(t) {
                startTime = startTime || t;
                let step = (t - startTime) / duration;
                let angle = ease(step, 2, startAngle);
                ctx.beginPath();
                ctx.arc(x, y, radius, startAngle * PI, angle * PI);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.stroke();

                if (step < 1) {
                    requestAnimationFrame(render);
                } else {
                    resolve();
                }
            }
            requestAnimationFrame(render);
        });
    }

    line(startX, startY, endX, endY, color, duration, width = 1) {
        startX *= 2;
        startY *= 2;
        endX *= 2;
        endY *= 2;
        let ctx = this.ctx;
        let startTime;
        return new Promise((resolve) => {
            function render(t) {
                startTime = startTime || t;
                let step = (t - startTime) / duration;
                let x = ease(step, endX - startX, startX);
                let y = ease(step, endY - startY, startY);
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.stroke();

                if (step < 1) {
                    requestAnimationFrame(render);
                } else {
                    resolve();
                }
            }
            requestAnimationFrame(render);
        });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    arc(arc, duration, transform = (x) => x, color, width = 1) {
        let startTime;
        return new Promise((resolve) => {
            function render(t) {
                startTime = startTime || t;
                let step = (t - startTime) / duration;
                let perc = ease(step, 1, 0);
                let toDraw = this.cutArc(arc, perc);
                this.drawArc(toDraw, transform, color, width);
                if (step < 1) {
                    requestAnimationFrame(render.bind(this));
                } else {
                    resolve();
                }
            }
            requestAnimationFrame(render.bind(this));
        });
    }

    getTotalDist(arc) {
        let last = arc[0];
        return arc.reduce((total, pt) => {
            total += dist(last, pt);
            last = pt;
            return total;
        }, 0);
    }

    cutArc(arc, perc) {
        let last = arc[0];
        let toGo = this.getTotalDist(arc) * perc;
        let toDraw = [last];
        for (var i = 1, len = arc.length; i < len; i++) {
            let pt = arc[i];
            let segmentDist = dist(last, pt);
            if (!segmentDist) {
                continue;
            }
            if (toGo === 0) {
                break;
            }
            if (segmentDist <= toGo) {
                toDraw.push(pt);
                toGo -= segmentDist;
                last = pt;
                continue;
            }
            let cutPerc = toGo / segmentDist;
            let x = (pt[0] - last[0]) * cutPerc + last[0];
            let y = (pt[1] - last[1]) * cutPerc + last[1];
            toDraw.push([x, y]);
            break;
        }
        return toDraw;
    }

    drawArc(arc, transform, color, width) {
        let {ctx} = this;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(...transform(arc[0]));
        arc.slice(1).forEach(pt => ctx.lineTo(...transform(pt)));
        ctx.stroke();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

module.exports = Drawer;
