// ===============================
//  2AM. RADIO – TIMER (intégré au player Howler)
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('time-display');
  const addBtn = document.getElementById('add-btn');

  let timeRemaining = 0;
  let timerInterval = null;

  // --- Fonctions utilitaires ---
  function pad(n) { return String(n).padStart(2, '0'); }

  function formatTime(sec) {
    if (sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${pad(m)}:${pad(s)}`;
  }

  function refreshDisplay() {
    if (document.activeElement !== input) {
      input.value = formatTime(timeRemaining);
    }
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        refreshDisplay();
        if (timeRemaining === 0) {
          stopTimer();
          pausePlayer();
        }
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // --- Pause du player (robuste) ---
  function pausePlayer(retry = 0) {
    const MAX_RETRIES = 10;
    const RETRY_DELAY_MS = 300;

    // 1) Appel de la fonction publique exposée par stream.js
    if (typeof window.pauseRadio === 'function') {
      try {
        window.pauseRadio();
        return;
      } catch (e) {
        console.error("pauseRadio() a lancé une erreur:", e);
      }
    }

    // 2) Fallback : si window.sound existe et a pause()
    if (window.sound && typeof window.sound.pause === 'function') {
      try {
        if (typeof window.sound.playing === 'function') {
          if (window.sound.playing()) window.sound.pause();
          else window.sound.pause();
        } else {
          window.sound.pause();
        }
        console.log("pausePlayer: fallback via window.sound.pause()");
        return;
      } catch (err) {
        console.error("Erreur lors du fallback pause:", err);
      }
    }

    // 3) Retry si player pas encore prêt
    if (retry < MAX_RETRIES) {
      console.log(`pausePlayer: player non prêt, retry ${retry+1}/${MAX_RETRIES} dans ${RETRY_DELAY_MS}ms`);
      setTimeout(() => pausePlayer(retry + 1), RETRY_DELAY_MS);
    } else {
      console.warn("pausePlayer: impossible de trouver le player après plusieurs essais.");
    }
  }

  // --- Parsing et application de l'input ---
  function parseTime(str) {
    if (!str) return 0;
    str = str.trim();
    if (str === '') return 0;

    let match = str.match(/^(\d+):(\d{1,2})$/);
    if (match) return parseInt(match[1]) * 60 + parseInt(match[2]);
    if (/^\d+$/.test(str)) return parseInt(str) * 60;
    match = str.match(/^(\d+)\s*m(?:in)?(?:\s*(\d+)\s*s(?:ec)?)?/i);
    if (match) return parseInt(match[1]) * 60 + (match[2] ? parseInt(match[2]) : 0);
    match = str.match(/^(\d+)\s*s$/i);
    if (match) return parseInt(match[1]);
    return null;
  }

  function applyInputValue() {
    const raw = input.value.trim();
    const secs = parseTime(raw);
    if (secs === null) {
      alert('Format invalide (ex: 15, 15:00, 1m30s)');
      input.value = formatTime(timeRemaining);
      return;
    }

    if (secs === 0) {
      timeRemaining = 0;
      stopTimer();
      refreshDisplay();
      return;
    }

    timeRemaining = secs;
    refreshDisplay();
    startTimer();
  }

  // --- Événements ---
  addBtn.addEventListener('click', () => {
    timeRemaining += 15 * 60; // +15 minutes
    refreshDisplay();
    startTimer();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      applyInputValue();
      input.blur();
    }
  });

  input.addEventListener('blur', applyInputValue);

  input.addEventListener('input', () => {
    if (input.value.trim() === '') {
      timeRemaining = 0;
      stopTimer();
    }
  });

  // --- Initialisation de l'affichage ---
  refreshDisplay();
});
