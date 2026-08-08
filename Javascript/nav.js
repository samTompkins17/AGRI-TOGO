/* =========================================
   AGRI-TOGO — Menu mobile (hamburger)
   Ouverture/fermeture, état ARIA et touche Échap
========================================= */

// Attend que le DOM soit chargé avant d'activer le menu mobile
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".nav-toggle-input");  // case à cocher invisible qui pilote le menu
    const label = document.querySelector(".nav-toggle-label");   // bouton hamburger visible
    if (!toggle) return;

    // Ouvre ou ferme le menu et synchronise l'attribut ARIA du bouton
    function setMenu(open) {
        toggle.checked = open;
        if (label) label.setAttribute("aria-expanded", String(open));
    }

    // Ferme le menu dès qu'un lien de navigation est cliqué
    document.querySelectorAll(".nav-bar ul a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    // Synchronise l'état ARIA quand le menu est ouvert/fermé autrement (ex. : clic sur la case)
    toggle.addEventListener("change", () => {
        if (label) label.setAttribute("aria-expanded", String(toggle.checked));
    });

    // Ferme le menu avec la touche Échap (accessibilité clavier)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setMenu(false);
    });
});
