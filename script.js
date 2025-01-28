
(async () => {
    await Promise.all([
        getBestMovie(), 
    ]);
})();


createHeader();


// FETCH ET CHECK :

async function fetchMovies(apiUrl) {
    return await makeRequest(apiUrl);
}

async function fetchMovieDetails(movieId) {
    const apiUrl = `http://localhost:8000/api/v1/titles/${movieId}`;
    const movieDetails = await makeRequest(apiUrl);
    
    console.log(movieDetails);

    return movieDetails;
}

async function makeRequest(apiUrl) {
    const response = await fetch(apiUrl);

    await checkResponseStatus(response);

    return response.json(); // Conversion directe
}

async function checkResponseStatus(response) {
    if (response.status === 404) {
        throw new Error("Ressource non trouvée (404)");
    } else if (response.status >= 500) {
        throw new Error("Erreur serveur, veuillez réessayer plus tard");
    } else if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
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




// LES GETS :

let isSectionCreated = false;

async function getBestMovie() {

    // console.log('Appel à getBestMovie') DEUX APPELS // SECTION GÉNÉREE DEUX FOIS
    // Si la section est déjà créée, on arrête l'exécution de la fonction
    if (isSectionCreated) return;

    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    try {
        const data = await makeRequest(apiUrl);

        if (data?.results?.length > 0) {
            const bestMovie = data.results[0];
            const detailedMovie = await fetchMovieDetails(bestMovie.id);

            // Vérification si section "Meilleur film" existe déjà
            let section = document.querySelector('section.best-movie-section');

            if (!section) {
                // Si la section n'existe pas encore, la créer
                section = createSection("Meilleur film");
                section.classList.add('best-movie-section');
                isSectionCreated = true;  // Marquer la section comme créée
            }

            displayBestMovie(detailedMovie, section); // Passe la section existante ou venant d'être créée à displayBestMovie()
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



// LES CREATE :

function createHeader() {
    const header = document.createElement('header');

    const titleBannerDiv = document.createElement('div');
    titleBannerDiv.classList.add('banner'); // gestion CSS
    const titleBannerImg = document.createElement('img');
    titleBannerImg.src = 'style/banner.jpg';
    titleBannerDiv.appendChild(titleBannerImg);

    header.appendChild(titleBannerDiv);

    const mainContainer = document.querySelector('main');
    mainContainer.appendChild(header);
}


function createSection(title) {
    const section = document.createElement('section');
    section.classList.add('section-container'); // gestion CSS

    const mainContainer = document.querySelector('main');
    mainContainer.appendChild(section);

    const h1 = document.createElement('h1');
    h1.textContent = title; // Titre dynamique
    section.appendChild(h1);

    return section;
}


// LES DISPLAY :


function displayBestMovie(bestMovieData, section) {
    // Crée le conteneur grille pour les éléments du film
    const container = document.createElement('div');
    container.classList.add('container', 'item-grid');
    
    const bestMovieDiv = document.createElement('div');
    bestMovieDiv.classList.add('best-movie');
    
    // Crée la div 'best-movie' pour les éléments du film
    const movieImgDiv = document.createElement('div');
    movieImgDiv.classList.add('best-movie-img');
    const movieImg = document.createElement('img');
    movieImg.src = bestMovieData.image_url; // URL dynamique de l'image
    movieImg.alt = bestMovieData.title;     // Alt dynamique (le titre du film)
    movieImgDiv.appendChild(movieImg);
    
    // Crée le titre du film avec un <h2> - dynamique
    const movieTitleDiv = document.createElement('div');
    movieTitleDiv.classList.add('best-movie-title');
    const movieTitle = document.createElement('h2');
    movieTitle.textContent = bestMovieData.title; // Titre dynamique du film
    movieTitleDiv.appendChild(movieTitle);
    
    // Crée le résumé du film - dynamique
    const movieSummaryDiv = document.createElement('div');
    movieSummaryDiv.classList.add('best-movie-summary');
    
    // Crée <p> pour afficher le résumé - dynamique, avec un texte par défaut si absent
    const movieSummary = document.createElement('p');
    movieSummary.textContent = bestMovieData.description || bestMovieData.long_description || "Résumé non disponible"; 
    // Voir si dans FIGMA, on doit mettre la version courte, et la longue pour Modal.
    movieSummaryDiv.appendChild(movieSummary);
    
    // Crée le bouton "Détails" - url dynamique
    const movieButtonDiv = document.createElement('div');
    movieButtonDiv.classList.add('best-movie-button');
    const movieButton = document.createElement('button');
    movieButton.classList.add('best-movie-details-button');
    movieButton.textContent = 'Détails';
    movieButtonDiv.appendChild(movieButton);
    
    // Lier le bouton à la page de détails avec l'URL dynamique
    movieButton.addEventListener('click', () => {
        window.location.href = `details.html?movie_id=${bestMovieData.id}`; // URL dynamique avec ID du film
    });
    
    // Ajouter tous les éléments à la structure du film
    bestMovieDiv.appendChild(movieImgDiv);
    bestMovieDiv.appendChild(movieTitleDiv);
    bestMovieDiv.appendChild(movieSummaryDiv);
    bestMovieDiv.appendChild(movieButtonDiv);
    
    // Ajoute la structure du film au conteneur grille ('container', 'item-grid')
    container.appendChild(bestMovieDiv);
    
    // Ajoute le conteneur grille à la section générée par createSection
    section.appendChild(container);
}