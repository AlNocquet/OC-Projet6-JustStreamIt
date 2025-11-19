
// IIFE (Immediately Invoked Function Expression)
    // Assurer que l'ordre d'affichage est respecté


/**
 * Bootstrap IIFE that initializes the application: creates the header
 * and sequentially loads all movie sections (best movie, global top 6,
 * predefined categories, and user-selected category).
 *
 * @async
 * @returns {Promise<void>}
 */

(async () => {
    await createHeader();
    await getBestMovie(); // Meilleur film
    await getTop6Movies(); // Top 6 films
    await getTop6MoviesByCategory("Fantasy"); // Catégorie "Fantasy"
    await getTop6MoviesByCategory("Sci-Fi"); // Catégorie "Sci-Fi"
    await getTop6Movies_OthersCategories(); // Catégorie à choix
})();

