// Modes
const MODE_CIRCLE = 1;
const MODE_SQUARE = 2;

// Constants
const MAX_RADIUS = 32;
const PAD_RADIUS = MAX_RADIUS * 2;
const MAX_SPEED = 0.25;
const NUM_BLOBS = 25;
const MODE = MODE_CIRCLE;

// Rectanglular intersection detection
const intersects = (l1, r1, t1, b1, l2, r2, t2, b2) => r1 >= l2 && l1 <= r2 && b1 >= t2 && t1 <= b2;

// Run code as soon as DOM is available
document.addEventListener('DOMContentLoaded', () => {

    // Declare variables
    let width, height, time, blobs, exclusionZone;

    // Grab canvas and context
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    // Thingy class
    class Thingy {
        constructor() {
            this.reinitialize();
        }

        // Initialize variables
        reinitialize() {
            this.a = 0;
            this.r = 0;
            this.c = Math.random() * 360;
            this.s = (MAX_SPEED + (Math.random() * MAX_SPEED)) / 2.0;
            this.x = (Math.random() * width) | 0;
            this.y = (Math.random() * height) | 0;
            while (intersects(
                this.x - PAD_RADIUS,
                this.x + PAD_RADIUS,
                this.y - PAD_RADIUS,
                this.y + PAD_RADIUS,
                exclusionZone.left,
                exclusionZone.right,
                exclusionZone.top,
                exclusionZone.bottom
            )) {
                this.x = (Math.random() * width) | 0;
                this.y = (Math.random() * height) | 0;
            }
        }

        // Update state
        update() {
            this.r += this.s;
            this.c += 1;

            // r <= 25%
            if (this.r < MAX_RADIUS * 0.25) {
                this.a = (this.r / (MAX_RADIUS * 0.25));
            }

            // r >= 25% && r <= 75%
            else if (this.r >= MAX_RADIUS * 0.25 && this.r <= MAX_RADIUS * 0.75) {
                this.a = 1;
            }

            // r >= 75% && r <= 100%
            else if (this.r >= MAX_RADIUS * 0.75 && this.r <= MAX_RADIUS) {
                this.a = (MAX_RADIUS - this.r) / (MAX_RADIUS * 0.25);
            }

            // r > 100%
            else {
                this.reinitialize();
            }
        }

        // Render object
        render() {
            ctx.strokeStyle = `hsla(${this.c},25%,75%,${this.a})`;
            ctx.beginPath();
            if (MODE === MODE_CIRCLE) {
                ctx.arc(
                    this.x, // x
                    this.y, // y
                    this.r, // r
                    0, // sAngle
                    2 * Math.PI, // eAngle
                );
            } else if (MODE === MODE_SQUARE) {
                ctx.rect(
                    this.x, // x
                    this.y, // y
                    this.r, // w
                    this.r // h
                );
            }
            ctx.stroke();
        }
    }

    // Update state
    const update = () => {
        blobs.forEach(b => b.update());
    }

    // Render scene
    const render = () => {
        blobs.forEach(b => b.render());
    }

    // Render loop
    const loop = () => {
        time += 0.1;
        update();
        ctx.clearRect(0, 0, width, height);
        render();
        window.requestAnimationFrame(loop);
    };

    // Setup
    const setup = () => {

        // Fitting function
        const fit = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            width = canvas.scrollWidth;
            height = canvas.scrollHeight;
            exclusionZone = document.querySelector('.wrapper').getBoundingClientRect();
        }

        // Fit canvas and refit on resize
        fit() || window.addEventListener('resize', fit);

        // Initialize variables
        time = Date.now();
        blobs = Array.from({length: NUM_BLOBS}).map(_ => new Thingy());

        // Success
        return true;
    }

    // Setup and start render loop
    setup() && loop();
});

