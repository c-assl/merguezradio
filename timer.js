const sliderWrapper = document.getElementById('slider-wrapper');
const clock = document.getElementById('clock-thumb');
const display = document.getElementById('timer-display');
const maxMinutes = 60;

let dragging = false;
let totalSeconds = 0;
let timerInterval;

// Convertit position de la lune en minutes
function positionToMinutes(x) {
  const rect = sliderWrapper.getBoundingClientRect();
  let percent = (x - rect.left) / rect.width;
  percent = Math.max(0, Math.min(1, percent));
  return Math.round(percent * maxMinutes);
}

// Met à jour la position de la lune en px selon minutes
function minutesToPosition(minutes) {
  const rect = sliderWrapper.getBoundingClientRect();
  return (minutes / maxMinutes) * rect.width;
}

// Met à jour le timer display
function updateDisplay(minutes, seconds = 0) {
  display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  clock.style.left = `${minutesToPosition(minutes)}px`;
}

function lancerPluieMerguez() {
  const rainContainer = document.getElementById("merguez-rain");
  
  for (let i = 0; i < 30; i++) { // nombre de merguez
    const merguez = document.createElement("div");
    merguez.classList.add("merguez");
    merguez.textContent = "🌭"; // tu peux remplacer par <img src="merguez.png">
    
    // Position horizontale aléatoire
    merguez.style.left = Math.random() * 100 + "vw";
    // Taille aléatoire
    merguez.style.fontSize = (1 + Math.random() * 2) + "rem";
    // Durée de chute aléatoire
    merguez.style.animationDuration = (3 + Math.random() * 3) + "s";
    
    rainContainer.appendChild(merguez);
    
    // Nettoyage après animation
    merguez.addEventListener("animationend", () => merguez.remove());
  }
}


// Lancer le timer
function startTimer(minutes) {
  clearInterval(timerInterval);
  totalSeconds = minutes * 60;

  // Sauvegarde dans localStorage pour reprendre après reload
  const endTimestamp = Date.now() + totalSeconds * 1000;
  localStorage.setItem('timerEnd', endTimestamp);

  function tick() {
    const remaining = Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));
    let mins = Math.floor(remaining / 60);
    let secs = remaining % 60;
    updateDisplay(mins, secs);

    if (remaining <= 0) {
      clearInterval(timerInterval);
      localStorage.removeItem('timerEnd');
  
      // 🎉 lancer la pluie de merguez
      lancerPluieMerguez();

      // 🔥 Stoppe le player
      if (isPlaying) {
        sound.pause();
        playIcon.src = playIconUrl; // ✅ corrige l'icône
        isPlaying = false;
      }
    }
  }

  tick();
  timerInterval = setInterval(tick, 1000);
}

// Drag de la lune
clock.addEventListener('mousedown', (e) => {
  dragging = true;
  e.preventDefault();
});
document.addEventListener('mouseup', (e) => {
  if (dragging) {
    dragging = false;
    const minutes = positionToMinutes(e.clientX);
    startTimer(minutes);
  }
});
document.addEventListener('mousemove', (e) => {
  if (dragging) {
    const minutes = positionToMinutes(e.clientX);
    updateDisplay(minutes);
  }
});

// Reprendre le timer si déjà en cours après reload
document.addEventListener('DOMContentLoaded', function () {
  const savedEnd = localStorage.getItem('timerEnd');
  if (savedEnd) {
    const remainingSeconds = Math.max(0, Math.floor((savedEnd - Date.now()) / 1000));
    if (remainingSeconds > 0) {
      totalSeconds = remainingSeconds;
      const minutes = Math.floor(totalSeconds / 60);
      startTimer(minutes);
    }
  }
});
