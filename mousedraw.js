// Constantes 

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const LIFETIME = 40000;
let points = [];

let lastX = null;
let lastY = null;
let lastTime = null;
let isDrawing = false;

// Le canvas fait toute la page

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Ajoute des points quand on clique

window.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const now = Date.now();
  lastX = e.clientX;
  lastY = e.clientY;
  lastTime = now;
  points.push({x: lastX, y: lastY, timestamp: now}); // Ajoute un premier point immédiatement
});

// Pas de dessin quand on ne clique pas

window.addEventListener('mouseup', () => {
  isDrawing = false;
  lastX = null;
  lastY = null;
  lastTime = null;
  points.push(null); // 2 dessins séparés ne sont pas reliés
});

// Extrpaole entre deux points

window.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const x = e.clientX;
  const y = e.clientY;
  const now = Date.now();

  if (lastX === null) {
    lastX = x;
    lastY = y;
    lastTime = now;
    return;
  }

  const dx = x - lastX;
  const dy = y - lastY;
  const dist = Math.hypot(dx, dy);
  const dt = now - lastTime;


  // Moins strict pour tracer même si on bouge peu
  if (dist >= 1) {
    const steps = Math.ceil(dist / 5);
    for (let i = 0; i < steps; i++) {
      const px = lastX + (dx * i / steps);
      const py = lastY + (dy * i / steps);
      points.push({x: px, y: py, timestamp: now});
    }
    lastX = x;
    lastY = y;
    lastTime = now;
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();

  points = points.filter(p => p === null || now - p.timestamp < LIFETIME);

  if (points.length > 1) {
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowBlur = 5;

    for (let i = 0; i < points.length - 1; i++) {
      const p = points[i];
      const next = points[i + 1];

      if (p === null || next === null) continue; // Separateur entre deux traits

      const age = now - p.timestamp;
      const alpha = 1 - age / LIFETIME;

      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.shadowColor = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
  }

  requestAnimationFrame(animate);
}

animate(); // démarre l'animation
