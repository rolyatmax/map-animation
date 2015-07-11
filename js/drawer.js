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

    circle(x, y, radius, color, step, width = 1) {
        x *= 2;
        y *= 2;
        radius *= 2;
        let startAngle = 0.5;
        let curAngle = 0;
        let ctx = this.ctx;
        return new Promise((resolve) => {
            function render() {
                curAngle += (2 - curAngle) * step;
                let angle = curAngle + startAngle;
                ctx.beginPath();
                ctx.arc(x, y, radius, startAngle * PI, angle * PI);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.stroke();

                if (abs(2 - curAngle) > 0.001) {
                    requestAnimationFrame(render);
                } else {
                    resolve();
                }
            }
            requestAnimationFrame(render);
        });
    }

    line(startX, startY, endX, endY, color, step, width = 1) {
        startX *= 2;
        startY *= 2;
        endX *= 2;
        endY *= 2;
        let curX = startX;
        let curY = startY;
        let ctx = this.ctx;
        return new Promise((resolve) => {
            function render() {
                curX += (endX - curX) * step;
                curY += (endY - curY) * step;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(curX, curY);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.stroke();

                if (abs(endX - curX) >= 1 || abs(endY - curY) >= 1) {
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

module.exports = Drawer;
