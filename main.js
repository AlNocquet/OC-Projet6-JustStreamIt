

(async () => {
    await Promise.all([
        getTop6MoviesByCategory(""),
        getTop6MoviesByCategory(undefined),
        getTop6MoviesByCategory("nonexistentgenre"),
        getBestMovie(),
        getTop6Movies(),
        getTop6MoviesByCategory("fantasy"),
        getTop6MoviesByCategory("Sci-Fi"),
    ]);
})();