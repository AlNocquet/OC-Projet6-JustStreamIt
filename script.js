
async function fetchMovies(apiUrl) {
    try {
        const response = await fetch(apiUrl);

        if (response.status === 404) {
            throw new Error("Ressource non trouvée (404)");
        } else if (response.status >= 500) {
            throw new Error("Erreur serveur, veuillez réessayer plus tard");
        } else if (!response.ok) { 
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Erreur lors de la requête API :", error);
        throw error;
    }
}


async function getBestMovie() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    try {
        const data = await fetchMovies(apiUrl);

        if (data?.results?.length > 0) {
            const bestMovie = data.results[0];
            console.log("Meilleur film :", bestMovie);
        } else {
            console.log("Aucun film trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du meilleur film :", error);
    }
}


async function getTop6Movies() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6&start=1";
    try {
        const data = await fetchMovies(apiUrl);

        if (data?.results?.length > 0) {
            console.log("6 Meilleurs films :", data.results);
        } else {
            console.log("Aucun film trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des 6 meilleurs films :", error);
    }
}


async function getTop6MoviesByCategory(category) {
    try {
        const allGenres = await fetchAllGenres();

        if (!isValidCategory(category, allGenres)) {
            console.warn("Catégorie non valide :", category);
            return;
        }

        const data = await fetchMoviesByCategory(category);

        const results = data?.results || []; 
        if (results.length > 0) {
            console.log(`${category} :`, results);
        } else {
            console.log(`Aucun film trouvé pour la catégorie ${category}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des films pour la catégorie ${category} :`, error);
    }
}


async function fetchAllGenres() {
    let allGenres = [];
    let nextPageUrl = "http://localhost:8000/api/v1/genres/";

    while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        allGenres = allGenres.concat(data.results);
        nextPageUrl = data.next || null;
    }

    return allGenres;
}

function isValidCategory(category, allGenres) {

    if (typeof category !== "string" || category.trim() === "") {
        console.warn("Catégorie invalide : elle doit être une chaîne non vide.");
        return false;  // Retourne false si la catégorie est invalide
    }

    const validCategories = allGenres.map(genre => genre.name.toLowerCase());
    return validCategories.includes(category.toLowerCase());
}


async function fetchMoviesByCategory(category) {
    const apiUrl = `http://localhost:8000/api/v1/titles/?genre=${encodeURIComponent(category)}&sort_by=-imdb_score&page_size=6`;
    return await fetchMovies(apiUrl);
}