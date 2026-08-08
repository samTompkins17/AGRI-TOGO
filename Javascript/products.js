/* =========================================
   AGRI-TOGO — Page Produits
   Recherche et filtrage du catalogue
========================================= */

// Attend que le DOM soit chargé avant d'activer la recherche et les filtres
document.addEventListener("DOMContentLoaded", () => {
    // --- Éléments de l'interface ---
    const search = document.getElementById("search");           // champ de recherche
    const buttons = document.querySelectorAll(".filter-btn");   // boutons de filtre par catégorie
    const cards = document.querySelectorAll(".product-card");   // toutes les cartes produits
    const noResult = document.getElementById("no-result");      // message « aucun produit trouvé »

    // Si un élément est absent (page différente), on n'initialise rien
    if (!search || !noResult || buttons.length === 0 || cards.length === 0) {
        return;
    }

    // Filtre de catégorie actif ; "all" = toutes les catégories
    let currentFilter = "all";

    // Applique la recherche ET le filtre de catégorie sur toutes les cartes
    function filterProducts() {
        const keyword = search.value.toLowerCase(); // terme recherché, insensible à la casse
        let visible = 0;

        cards.forEach((card) => {
            const category = card.dataset.category; // catégorie déclarée sur la carte (data-category)
            const titleEl = card.querySelector("h3");
            const title = (titleEl ? titleEl.textContent : "").toLowerCase();

            // La carte doit correspondre à la catégorie ET au terme recherché
            const matchCategory = currentFilter === "all" || category === currentFilter;
            const matchSearch = title.includes(keyword);
            const shouldShow = matchCategory && matchSearch;

            // Affiche ou masque la carte
            card.style.display = shouldShow ? "block" : "none";

            if (shouldShow) {
                visible++;
            }
        });

        // Affiche le message « aucun produit » uniquement si rien n'est visible
        noResult.style.display = visible === 0 ? "block" : "none";
    }

    // Clic sur un bouton de filtre : met à jour la catégorie active puis re-filtre
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            // Désactive tous les boutons puis active celui cliqué
            buttons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            currentFilter = button.dataset.filter;
            filterProducts();
        });
    });

    // Recherche en direct à chaque frappe dans le champ
    search.addEventListener("keyup", filterProducts);

    // Applique le filtre initial au chargement de la page
    filterProducts();
});