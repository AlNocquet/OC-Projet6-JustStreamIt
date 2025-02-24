
// IIFE (Immediately Invoked Function Expression)
    // Assurer que l'ordre d'affichage est respecté

(async () => {
    await createHeader();
    await getBestMovie(); // Meilleur film
    await getTop6Movies(); // Top 6 films
    await getTop6MoviesByCategory("Fantasy"); // Catégorie "Fantasy"
    await getTop6MoviesByCategory("Sci-Fi"); // Catégorie "Sci-Fi"
    await getTop6Movies_OthersCategories(); // Catégorie à choix
})();

