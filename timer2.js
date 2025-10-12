document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('time-display');
  const addBtn = document.getElementById('add-btn');

  let timeRemaining = 0;
  let timerInterval = null;

  // Affichage mm:ss
  const pad = n => String(n).padStart(2,'0');
  const formatTime = sec => `${pad(Math.floor(sec/60))}:${pad(sec%60)}`;

  function refreshDisplay() {
    if (document.activeElement !== input) input.value = formatTime(timeRemaining);
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      if(timeRemaining > 0){
        timeRemaining--;
        refreshDisplay();
        if(timeRemaining === 0){
          stopTimer();
          pausePlayer();
        }
      }
    }, 1000);
  }

  function stopTimer(){
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function pausePlayer(){
    if(typeof window.pauseRadio === 'function'){
      window.pauseRadio();
      return;
    }
    if(window.sound && typeof window.sound.pause === 'function'){
      window.sound.pause();
    }
  }

  function parseTime(str){
    str = str.trim();
    if(/^(\d+):(\d{1,2})$/.test(str)){
      const m=RegExp.$1, s=RegExp.$2;
      return parseInt(m)*60 + parseInt(s);
    }
    if(/^\d+$/.test(str)) return parseInt(str)*60;
    return 0;
  }

  function applyInputValue(){
    const secs = parseTime(input.value);
    timeRemaining = secs;
    refreshDisplay();
    startTimer();
  }

  addBtn.addEventListener('click', () => {
    timeRemaining += 15*60;
    refreshDisplay();
    startTimer();
  });

  input.addEventListener('keydown', e => {
    if(e.key === 'Enter') {
      e.preventDefault();
      applyInputValue();
      input.blur();
    }
  });

  input.addEventListener('blur', applyInputValue);

  refreshDisplay();
});
