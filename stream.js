  var sound = new Howl({
    src: ['https://2am-radio.fr:8000/radio.mp3'],
    html5: true
  });

  var isPlaying = false;
  var playBtn = document.getElementById("play-btn");
  var playIcon = document.getElementById("play-icon");
  var artistName = document.getElementById("artist-name");
  var trackTitle = document.getElementById("track-title");
  var coverArt = document.getElementById("cover-art");

  // Icône pause pixel
  var pauseIconUrl = "https://static.thenounproject.com/png/pixel-pause-icon-4603110-512.png";
  var playIconUrl = "https://static.vecteezy.com/system/resources/previews/026/997/083/large_2x/play-button-pixelated-rgb-color-ui-icon-music-player-bar-play-multimedia-file-simplistic-filled-8bit-graphic-element-retro-style-design-for-arcade-video-game-art-editable-isolated-image-vector.jpg";

  // Gestion Play/Pause
  playBtn.onclick = function() {
    if (isPlaying) {
      sound.pause();
      playIcon.src = playIconUrl;
    } else {
      sound.play();
      playIcon.src = pauseIconUrl;
    }
    isPlaying = !isPlaying;
  };

  // Compatibilité mobile (tap tactile)
  playBtn.addEventListener('touchstart', function(e){
    e.preventDefault();
    playBtn.click();
  });

  // Fonction pour récupérer les infos Now Playing
  async function fetchNowPlaying() {
    try {
      let response = await fetch("https://2am-radio.fr:5443/api/nowplaying/2am_radio");
      let data = await response.json();
      if (data && data.now_playing && data.now_playing.song) {
        artistName.textContent = data.now_playing.song.artist || "Artiste inconnu";
        trackTitle.textContent = data.now_playing.song.title || "Titre inconnu";
        coverArt.src = data.now_playing.song.art || "https://via.placeholder.com/60x60?text=🎵";
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