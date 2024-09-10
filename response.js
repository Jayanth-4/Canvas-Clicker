const canvas = document.getElementById('paintCanvas');
const context = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const statusDiv = document.getElementById('status');

let isDrawing = false;
let startX, startY;
let circles = [];

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.stroke();
}

function isInsideCircle(circle, x, y) {
    const distance = Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2));
    return distance <= circle.radius;
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));

        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas to avoid trails
        circles.forEach(circle => drawCircle(circle.x, circle.y, circle.radius, circle.color));
        drawCircle(startX, startY, radius, getRandomColor());
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        const color = getRandomColor();

        circles.push({ x: startX, y: startY, radius, color });
        drawCircle(startX, startY, radius, color);
    }
    isDrawing = false;
});

canvas.addEventListener('click', (e) => {
    const clickX = e.offsetX;
    const clickY = e.offsetY;
    let Striked = false;

    for (let circle of circles) {
        if (isInsideCircle(circle, clickX, clickY)) {
            Striked = true;
            break;
        }
    }

    if (Striked) {
        statusDiv.textContent = 'Striked ✔️';
    } else {
        statusDiv.textContent = 'Missed';
    }
});

canvas.addEventListener('dblclick', (e) => {
    const clickX = e.offsetX;
    const clickY = e.offsetY;

    circles = circles.filter(circle => !isInsideCircle(circle, clickX, clickY));
    context.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => drawCircle(circle.x, circle.y, circle.radius, circle.color));
});

resetButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    circles = [];
    statusDiv.textContent = '';
});
