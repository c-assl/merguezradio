/**
 * Active une fenêtre de style "popup Windows" (drag, toggle, close)
 * @param {string} openBtnId - id du bouton d'ouverture
 * @param {string} windowId - id de la fenêtre popup
 * @param {string} closeBtnId - id du bouton de fermeture
 * @param {object} options - options de centrage et comportement
 */
function setupWindowPopup(openBtnId, windowId, closeBtnId, options = {}) {
  const openBtn = document.getElementById(openBtnId);
  const popup = document.getElementById(windowId);
  const closeBtn = document.getElementById(closeBtnId);
  const header = popup.querySelector(".window-header");

  const defaultPos = {
    left: options.left || "50%",
    top: options.top || "50%",
    transform: options.transform || "translate(-50%, -50%)",
  };

  // --- Toggle ouverture / fermeture ---
  openBtn.addEventListener("click", () => {
    if (popup.style.display === "block") {
      popup.style.display = "none";
    } else {
      popup.style.display = "block";
      Object.assign(popup.style, defaultPos);
    }
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // --- Drag & Drop ---
  let offsetX = 0, offsetY = 0;
  let isDragging = false;

  header.addEventListener("mousedown", (e) => {
    e.preventDefault();

    // 1️⃣ Convertir la position initiale en pixels si c'est la première fois
    const rect = popup.getBoundingClientRect();
    popup.style.left = rect.left + "px";
    popup.style.top = rect.top + "px";
    popup.style.transform = "none";

    // 2️⃣ Calcul offsets
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    isDragging = true;
    header.style.cursor = "grabbing";
    popup.style.transition = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    popup.style.left = `${e.clientX - offsetX}px`;
    popup.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    header.style.cursor = "move";
  });
}