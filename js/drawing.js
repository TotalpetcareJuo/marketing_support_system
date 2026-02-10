export class DrawingManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true });

        // State
        this.isDrawing = false;
        this.currentTool = 'pen'; // 'pen' | 'eraser'
        this.color = '#FF7A00'; // Juo Orange
        this.lineWidth = 3;
        this.eraserSize = 20;
        this.lastX = 0;
        this.lastY = 0;

        // Initialize
        this.resize();
        this.bindEvents();
    }

    // Set up event listeners
    bindEvents() {
        // Mouse Events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Touch Events
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
    }

    // Resize canvas to match display size
    resize() {
        const rect = this.canvas.getBoundingClientRect();

        // Check if size actually changed to avoid clearing on minor events
        if (this.canvas.width !== rect.width || this.canvas.height !== rect.height) {
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;

            // Context properties reset on resize, so restore them
            this.updateContext();
        }
    }

    // Update context style based on current tool
    updateContext() {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        if (this.currentTool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = this.eraserSize;
        } else {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.lineWidth;
        }
    }

    // Tool Management
    setTool(tool) {
        this.currentTool = tool;
        this.updateContext();
    }

    setColor(color) {
        this.color = color;
        if (this.currentTool === 'pen') {
            this.updateContext();
        }
    }

    setLineWidth(width) {
        this.lineWidth = width;
        if (this.currentTool === 'pen') {
            this.updateContext();
        }
    }

    setEraserSize(size) {
        this.eraserSize = size;
        if (this.currentTool === 'eraser') {
            this.updateContext();
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Coordinate Helper
    getCoordinates(e) {
        // Check if it's a touch event
        if (e.touches && e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        // Mouse event
        return {
            x: e.offsetX,
            y: e.offsetY
        };
    }

    // Event Handlers
    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCoordinates(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    draw(e) {
        if (!this.isDrawing) return;

        // Prevent scrolling on touch devices
        // This is critical for the "canvas on top of scrollable page" issue
        if (e.type === 'touchmove') {
            e.preventDefault();
        }

        const coords = this.getCoordinates(e);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();

        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    // Touch Event Wrappers
    handleTouchStart(e) {
        e.preventDefault(); // Prevent default touch actions like simulating mouse
        if (e.touches.length === 1) { // Single touch only
            this.startDrawing(e);
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 1) {
            this.draw(e);
        }
    }
}
