
(async () => {
    await Promise.all([
        getBestMovie(), 
        getTop6Movies(), 
        getTop6MoviesByCategory("fantasy"), 
        getTop6MoviesByCategory("Sci-Fi"),
    ]);
})();