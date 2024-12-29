
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
        let allGenres = []; 
        let nextPageUrl = "http://localhost:8000/api/v1/genres/";


        while (nextPageUrl) {
            const genresResponse = await fetch(nextPageUrl);

            if (!genresResponse.ok) {
                throw new Error("Erreur lors de la récupération des genres");
            }

            const genresData = await genresResponse.json(); 
            allGenres = allGenres.concat(genresData.results); 

            nextPageUrl = genresData.next || null; 
        }

        const validCategories = allGenres.map(genre => genre.name.toLowerCase()); 

        if (!category || typeof category !== "string" || category.trim() === "" || !validCategories.includes(category.toLowerCase())) {
            console.warn("Catégorie non reconnue ou invalide :", category);
            return; 
        }

        const apiUrl = `http://localhost:8000/api/v1/titles/?genre=${encodeURIComponent(category)}&sort_by=-imdb_score&page_size=6`;

        const data = await fetchMovies(apiUrl);

        if (data?.results?.length > 0) {
            console.log(`${category} :`, data.results);
        } else {
            console.log(`Aucun film trouvé pour la catégorie ${category}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des films pour la catégorie ${category} :`, error);
    }
}