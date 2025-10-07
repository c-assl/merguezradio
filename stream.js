// URL du flux
const STREAM_URL = "https://2am-radio.fr:8000/radio.mp3";

// Icônes
const playIconUrl = "https://static.vecteezy.com/system/resources/previews/026/997/083/large_2x/play-button-pixelated-rgb-color-ui-icon-music-player-bar-play-multimedia-file-simplistic-filled-8bit-graphic-element-retro-style-design-for-arcade-video-game-art-editable-isolated-image-vector.jpg";
const pauseIconUrl = "https://static.thenounproject.com/png/pixel-pause-icon-4603110-512.png";

// DOM
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const artistName = document.getElementById("artist-name");
const trackTitle = document.getElementById("track-title");
const coverArt = document.getElementById("cover-art");

let isPlaying = false;
let sound = null;

// Fonction pour créer le player Howler
function initPlayer() {
  if (sound) sound.unload();

  sound = new Howl({
    src: [STREAM_URL],
    html5: true,
    format: ['mp3'],
    onplay: () => { 
      isPlaying = true; 
      playIcon.src = pauseIconUrl; 
    },
    onpause: () => { 
      isPlaying = false; 
      playIcon.src = playIconUrl; 
    },
    onstop: () => { 
      isPlaying = false; 
      playIcon.src = playIconUrl; 
    },
    onloaderror: (id, err) => { 
      console.error("Erreur chargement flux :", err);
      reconnect();
    },
    onplayerror: () => {
      // tente de relancer le flux si play plante
      sound.once('unlock', () => { sound.play(); });
    },
    onend: () => {
      // jamais appelé normalement sur un flux live, mais sécurité
      reconnect();
    }
  });
}

// Fonction pour relancer le flux automatiquement
function reconnect() {
  console.log("Reconnexion automatique du flux...");
  if (isPlaying) {
    initPlayer();
    sound.play();
  } else {
    initPlayer();
  }
}

// Gestion Play/Pause
playBtn.onclick = () => {
  if (!sound) initPlayer();

  if (isPlaying) {
    sound.pause();
  } else {
    sound.play();
  }
};

// Compatibilité mobile
playBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  playBtn.click();
});

// Récupération des infos Now Playing
async function fetchNowPlaying() {
  try {
    const response = await fetch("https://2am-radio.fr:5443/api/nowplaying/2am_radio");
    const data = await response.json();

    if (data && data.now_playing && data.now_playing.song) {
      artistName.textContent = data.now_playing.song.artist || "Artiste inconnu";
      trackTitle.textContent = data.now_playing.song.title || "Titre inconnu";
      coverArt.src = data.now_playing.song.art || "https://via.placeholder.com/60x60?text=🎵";
    } else {
      artistName.textContent = "Radio en direct 🎶";
      trackTitle.textContent = "";
      coverArt.src = "https://via.placeholder.com/60x60?text=🎵";
    }
  } catch (e) {
    artistName.textContent = "Radio en direct 🎶";
    trackTitle.textContent = "";
    coverArt.src = "https://via.placeholder.com/60x60?text=🎵";
  }
}

// Mise à jour toutes les 15 secondes
fetchNowPlaying();
setInterval(fetchNowPlaying, 15000);
