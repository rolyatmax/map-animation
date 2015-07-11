const PI = Math.PI;
let abs = Math.abs;

class Drawer {
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
}

function ease(step, change, start) {
    return change * (1 - Math.pow(1 - step, 3)) + start;
}

module.exports = Drawer;
