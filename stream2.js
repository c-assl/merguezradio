const STREAM_URL = "https://2am-radio.fr:8000/radio.mp3";

const playIconUrl = "./images/pixel icon/play.png";
const pauseIconUrl = "./images/pixel icon/pause.png";

const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");

const titleBox = document.getElementById("title-text");
const artistBox = document.getElementById("artist-text");
const coverArt = document.getElementById("cover-art");


let isPlaying = false;
let sound = null;

// ---------------------
// INITIALISATION DU PLAYER
// ---------------------
function initPlayer() {
  if (sound) sound.unload();

  sound = new Howl({
    src: [STREAM_URL],
    html5: true,
    format: ['mp3'],
    onplay: () => { isPlaying = true; playIcon.src = pauseIconUrl; },
    onpause: () => { isPlaying = false; playIcon.src = playIconUrl; },
    onstop: () => { isPlaying = false; playIcon.src = playIconUrl; },
    onloaderror: (id, err) => { console.error("Erreur flux :", err); reconnect(); },
    onplayerror: () => { sound.once('unlock', () => { sound.play(); }); },
    onend: reconnect
  });
}

// Reconnexion automatique
function reconnect() {
  console.log("Reconnexion automatique du flux...");
  if (isPlaying) { initPlayer(); sound.play(); }
  else { initPlayer(); }
}

// ---------------------
// BOUTON PLAY / PAUSE
// ---------------------
playBtn.onclick = () => {
  if (!sound) initPlayer();
  if (isPlaying) sound.pause(); 
  else sound.play();
};

playBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  playBtn.click();
});

// ---------------------
// FETCH NOW PLAYING
// ---------------------
async function fetchNowPlaying() {
  try {
    const response = await fetch("https://2am-radio.fr:5443/api/nowplaying/2am_radio");
    const data = await response.json();

    console.log("NowPlaying API data:", data); // <- pour debug

    if (data && data.now_playing && data.now_playing.song) {
      const song = data.now_playing.song;

      // Titre et artiste
      const artist = song.artist || "Artiste inconnu";
      const title = song.title || "Titre inconnu";

      // Cover (avec fallback si l’URL est relative ou vide)
      let coverUrl = song.art || "https://via.placeholder.com/60x60?text=🎵";
      if (coverUrl && !coverUrl.startsWith("http")) {
        coverUrl = `https://2am-radio.fr${coverUrl}`;
      }

      // Mise à jour du player
        titleBox.textContent = title;
        artistBox.textContent = artist;
        coverArt.src = song.art;
      // Fallback si image invalide
      coverArt.onerror = () => {
        coverArt.src = "https://via.placeholder.com/60x60?text=🎵";
      };

      // Mise à jour des boîtes rétro
      document.getElementById("title-text").textContent = title;
      document.getElementById("artist-text").textContent = artist;

    } else {
      resetNowPlaying();
    }
  } catch (e) {
    resetNowPlaying();
    console.error("Erreur API NowPlaying:", e);
  }
}

// ---------------------
// RESET PLAYER
// ---------------------
function resetNowPlaying() {
  trackTitle.textContent = "Radio en direct 🎶";
  artistName.textContent = "";
  coverArt.src = "https://via.placeholder.com/60x60?text=🎵";

  document.getElementById("title-text").textContent = "Titre inconnu";
  document.getElementById("artist-text").textContent = "Artiste inconnu";
}

// ---------------------
// AUTO REFRESH
// ---------------------
fetchNowPlaying();
setInterval(fetchNowPlaying, 15000);
