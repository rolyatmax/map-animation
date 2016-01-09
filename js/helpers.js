export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function rAF() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}
