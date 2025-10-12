var backgrounds = [
  { start: 20, end: 9, url: 'images/backgrounds/background_matin2.gif' },
  { start: 9, end: 13, url: 'images/backgrounds/background_matin2.gif' },
  { start: 13, end: 16, url: 'images/backgrounds/background_idm.gif' },
  { start: 16, end: 23, url: 'images/backgrounds/background_idm.gif' }
];

function isInRange(hour, start, end) {
  if (start < end) {
    return hour >= start && hour < end;
  } else { // traverse minuit
    return hour >= start || hour < end;
  }
}

function setBackgroundByHour() {
  var hour = new Date().getHours(); // 0-23
  var bg = backgrounds.find(b => isInRange(hour, b.start, b.end));
  if (bg) {
    document.body.style.backgroundImage = "url('" + bg.url + "')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
  }
}

// Initialisation
setBackgroundByHour();

// Mise à jour toutes les heures
setInterval(setBackgroundByHour, 60 * 60 * 1000);
