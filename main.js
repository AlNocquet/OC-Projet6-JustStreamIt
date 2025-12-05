
// IIFE (Immediately Invoked Function Expression)
    // Assurer que l'ordre d'affichage est respecté


/**
 * bootstrap function IIFE that initializes the application: creates the header
 * and sequentially loads all movie sections (best movie, global top 6,
 * predefined categories, and user-selected category).
 *
 * @async
 * @returns {Promise<void>}
 */

(async () => {
    await createHeader();
    await getBestMovie();
    await getTop6Movies();
    await getTop6MoviesByCategory("Fantasy");
    await getTop6MoviesByCategory("Sci-Fi");
    await getTop6Movies_OthersCategories();
})();

