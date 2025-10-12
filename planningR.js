document.addEventListener("DOMContentLoaded", () => {
  setupWindowPopup("open-planning-btn", "planning-window", "close-planning-btn", {
    left: "60%", top: "40%", transform: "translate(-60%, -40%)"
  });
});

function toISODateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function getWeekRange(date = new Date()) {
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setHours(0,0,0,0);
  sunday.setDate(date.getDate() - day);
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  return { start: sunday, end: saturday };
}

async function fetchWeekSchedule(stationShortName = '2am_radio') {
  const wk = getWeekRange();
  const startStr = toISODateLocal(wk.start);
  const endStr = toISODateLocal(wk.end);
  const url = `https://2am-radio.fr:5443/api/station/${encodeURIComponent(stationShortName)}/schedule?start=${startStr}&end=${endStr}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur HTTP ' + res.status);
  return res.json();
}

function getISOFromShow(show, key) {
  if (show[key]) return show[key];
  if (show[key + '_timestamp']) return new Date(show[key + '_timestamp'] * 1000).toISOString();
  return null;
}

async function renderSchedule() {
  const container = document.getElementById('planning-container');
  container.innerHTML = '';
  try {
    const data = await fetchWeekSchedule('2am_radio');
    const days = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
    const grouped = {};
    days.forEach(d => grouped[d] = []);

    (Array.isArray(data) ? data : (data.schedule || data.schedule_entries || []))
      .forEach(show => {
        const startISO = getISOFromShow(show, 'start');
        if (!startISO) return;
        const dt = new Date(startISO);
        const dayName = days[dt.getDay()];
        grouped[dayName].push({
          startISO,
          endISO: getISOFromShow(show, 'end'),
          name: show.name || show.title || ""
        });
      });

    const formatTime = t => {
      const dt = new Date(t);
      const hours = dt.getHours().toString().padStart(2,'0');
      return `${hours}h`;
    };


    days.forEach(day => {
      const col = document.createElement('div');
      col.className = 'day-column';
      let html = `<div class="day-title">${day}</div>`;

      const shows = grouped[day] || [];
      if (!shows.length) {
        html += `<p style="opacity:0.8;">Aucune émission</p>`;
      } else {
        shows.sort((a,b) => new Date(a.startISO) - new Date(b.startISO));
        shows.forEach(s => {
          const cleanTitle = s.name.replace(/^Playlist:\s*/i, '');
          html += `
            <div class="show">
              <div class="show-time">${formatTime(s.startISO)}-${formatTime(s.endISO)}</div>
              <div class="show-title">${cleanTitle}</div>
            </div>
          `;
        });
      }

      col.innerHTML = html;
      container.appendChild(col);
    });
  } catch (err) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center;">Erreur : ${err.message}</p>`;
    console.error(err);
  }
}

renderSchedule();