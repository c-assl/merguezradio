const API_URL = "https://2am-radio.fr:5443/api/nowplaying/2am_radio";
const container = document.getElementById("historique");
const openHistoryBtn = document.getElementById("open-history-btn");
const HistoryWindow = document.getElementById("history-window");
const closeHistoryBtn = document.getElementById("close-history-btn");

document.addEventListener("DOMContentLoaded", () => {
  setupWindowPopup("open-history-btn", "history-window", "close-history-btn", {
    left: "60%", top: "40%", transform: "translate(-60%, -40%)"
  });
});


async function chargerHistorique() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const historique = data.song_history.slice(0, 5);
    container.innerHTML = ""; // vide avant rechargement
    historique.forEach(item => {
      const song = item.song;
      const cover = song.art || "https://via.placeholder.com/60?text=♪";
      const titre = song.title || "Titre inconnu";
      const artiste = song.artist || "Artiste inconnu";

      // --- Calcul "il y a ... minutes"
      let minutesAgoText = "";
      if (item.played_at) { // timestamp en secondes
        const now = Date.now();
        const playedTime = item.played_at * 1000; // converti en ms
        const diffMin = Math.floor((now - playedTime) / 60000);
        minutesAgoText = `${diffMin} m`;
      }

      const div = document.createElement("div");
      div.className = "track";
      div.innerHTML = `
        <div class="track-left">
          <img src="${cover}" alt="cover">
          <div class="info">
            <div class="title">${titre}</div>
            <div class="artist">${artiste}</div> 
          </div>
        </div>
        <div class="minutes-ago">${minutesAgoText}</div>
      `;
      container.appendChild(div);
    });
  } catch (e) {
    container.innerHTML = "<p>Erreur de chargement de l'historique.</p>";
    console.error(e);
  }
}

// Charger immédiatement et rafraîchir toutes les 60 secondes
chargerHistorique();
setInterval(chargerHistorique, 60000);