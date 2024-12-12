

async function getBestMovie() {

    try {
        const response = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"); // Attendre réponse promesse retournée par fetch()
        // Vérifier réponse HTTP OK (200 à 299 et non 400 ou 500)
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);  // Lancer une erreur si la réponse n'est pas OK
        }

        const data = await response.json(); // Attendre contenu de la réponse converti en format JSON (en utilisant response.json())

        // Vérifier que True : l'objet data existe + la propriété results présente et elle contient au moins un élément (en vérifiant la longueur de data.results).
        if (data?.results?.length > 0)  {
            const bestMovie = data.results[0]; // Sélection premier de la liste
            console.log("Meilleur film : ", bestMovie);

        } else {
            console.log("Aucun film trouvé");
        }

    // Attraper et afficher toutes erreurs générales (réseau, parsing JSON, etc.).
    } catch (error) {
        console.error("Erreur lors de la récupération du meilleur film : ", error);
    }
}


async function getTop6Movies() {
    try {
        const response = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6&start=1");
        // or "sort_by=-imdb_score&page_size=7&start=0"
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();

        if (data?.results?.length > 0) {
            const topMovies = data.results  //.slice(1, 7); 
            console.log("6 Meilleurs films : ", topMovies);

        } else {
            console.log("Aucun film trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des 6 meilleurs films : ", error);
    }
}


async function getTop6MoviesByCategory(category) {

    const validCategories = ["fantasy", "Sci-Fi", "action", "drama", "comedy", "horror", "romance"];

    // Validation : ni null, ni undefined, ni false comme vide, ni uniquement composé uniquement d'espaces ; bien chaîne de caractères, catégorie existantes.
    if (!category || typeof category !== "string" || category.trim() === "" || !validCategories.includes(category)) {
        console.warn("Catégorie non reconnue ou invalide :", category); // message console d'alerte
        return; // Annule l'exécution requête API non reconnues par elle
    }

    try {
        const apiUrl = `http://localhost:8000/api/v1/titles/?genre=${encodeURIComponent(category)}&sort_by=-imdb_score&page_size=6`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
            console.log(`${category} : `, data.results);
        } else {
            console.log(`Aucun film trouvé pour la catégorie ${category}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des films pour la catégorie ${category} :`, error);
    }
}

