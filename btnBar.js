const btnPlanning = document.getElementById('toggle-planning');
const btnAbout = document.getElementById('toggle-about');
const planning = document.getElementById('planning');
const aboutText = document.getElementById('about-text');

btnPlanning.addEventListener('click', () => {
  const isVisible = planning.style.display === 'table';
  planning.style.display = isVisible ? 'none' : 'table';
  aboutText.style.display = 'none'; // masque le texte si le planning est affiché
});

btnAbout.addEventListener('click', () => {
  const isVisible = aboutText.style.display === 'block';
  aboutText.style.display = isVisible ? 'none' : 'block';
  planning.style.display = 'none'; // masque le planning si le texte est affiché
});
