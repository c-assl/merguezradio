async function chargerPlanning() {
  try {
    const response = await fetch("https://2am-radio.fr:5443/api/station/2am_radio/schedule");
    const data = await response.json();

    // Jours en français (ordre lundi → dimanche)
    const jours = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
    const colonnes = {};
    jours.forEach(j => colonnes[j] = []);

    data.forEach(event => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);

      // Itérer sur tous les jours couverts par l'événement
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dayIndex = currentDate.getDay(); // 0=dimanche ... 6=samedi
        const jour = jours[(dayIndex + 6) % 7]; // Décalage pour commencer lundi

        // Calcul de l'heure à afficher pour ce jour
        let heureDebut = "00h";

        if (currentDate.toDateString() === startDate.toDateString()) {
          heureDebut = startDate.getHours().toString().padStart(2,'0') + "h";
        }

        // Ajouter la playlist pour ce jour
        colonnes[jour].push(`${heureDebut} - ${event.title}`);

        // Passer au jour suivant
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0,0,0,0);
      }
    });

    // Construire la ligne HTML
    let row = "";
    jours.forEach(j => {
      row += `<td>${colonnes[j].join("<br>")}</td>`;
    });

    document.getElementById("planning-body").innerHTML = row;

  } catch (e) {
    console.error("Erreur lors du chargement du planning :", e);
    document.getElementById("planning-body").innerHTML =
      "<td colspan='7'>Impossible de charger le planning.</td>";
  }
}

// Charger automatiquement
chargerPlanning();
