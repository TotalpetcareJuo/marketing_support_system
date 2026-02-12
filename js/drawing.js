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
        // Use Pointer Events for unified Mouse/Touch/Pen handling
        this.canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        this.canvas.addEventListener('pointermove', this.handlePointerMove.bind(this));
        this.canvas.addEventListener('pointerup', this.handlePointerUp.bind(this));
        this.canvas.addEventListener('pointercancel', this.handlePointerUp.bind(this));
        this.canvas.addEventListener('pointerout', this.handlePointerUp.bind(this));

        // Disable context menu to allow pen button (Right Click) usage
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
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

    // Event Handlers
    handlePointerDown(e) {
        // Detect Pen Button (Button 3 is the barrel button on many pens, often maps to right click)
        // Or buttons field bitmask: 2 = Right button (Barrel), 32 = Eraser button
        const isQuickEraser = e.pointerType === 'pen' && (e.buttons & 2 || e.buttons & 32);

        if (isQuickEraser) {
            this.tempTool = this.currentTool;
            this.setTool('eraser');
        }

        this.isDrawing = true;
        this.canvas.setPointerCapture(e.pointerId);

        const coords = this.getCoordinates(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    handlePointerMove(e) {
        if (!this.isDrawing) return;

        // Prevent scrolling
        e.preventDefault();

        const coords = this.getCoordinates(e);

        // Update context based on pressure if available
        if (e.pointerType === 'pen' && e.pressure > 0) {
            const baseWidth = this.currentTool === 'eraser' ? this.eraserSize : this.lineWidth;
            // Linear scale pressure to width (pressure is 0.0 to 1.0)
            // We'll make it vary between 50% and 150% of base width
            this.ctx.lineWidth = baseWidth * (0.5 + e.pressure);
        } else {
            this.ctx.lineWidth = this.currentTool === 'eraser' ? this.eraserSize : this.lineWidth;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();

        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    handlePointerUp(e) {
        if (!this.isDrawing) return;

        this.isDrawing = false;
        this.canvas.releasePointerCapture(e.pointerId);

        // Restore tool if it was a quick eraser
        if (this.tempTool) {
            this.setTool(this.tempTool);
            this.tempTool = null;
        }
    }

    // Coordinate Helper (Updated for PointerEvents)
    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}
