
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

    return response.json(); // Conversion directe en JSON
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
        return false;  // Retourne false si catégorie invalide
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
    // Voir si on doit éviter la multiplication d'appel ?

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
    // console.log('Appel à getTop6Movies()) DEUX APPELS // SECTION GÉNÉREE DEUX FOIS
    // Voir si on doit éviter la multiplication d'appel ?

    // Si la section est déjà créée, on arrête l'exécution de la fonction

    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=6";
    try {
        const data = await fetchMovies(apiUrl);

        if (data?.results?.length > 0) {
            displayMovies(data.results, "Top films toutes catégories");
        } else {
            console.log("Aucun film trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des 6 meilleurs films :", error);
    }
}


async function getTop6MoviesByCategory(category) {
    // console.log('Appel à getTop6MoviesByCategory(category)) DEUX APPELS // SECTION GÉNÉREE DEUX FOIS
    // Si la section est déjà créée, on arrête l'exécution de la fonction

    try {
        const allGenres = await fetchAllGenres();

        if (!isValidCategory(category, allGenres)) {
            console.warn("Catégorie non valide :", category);
            return;
        }

        const data = await fetchMoviesByCategory(category);
        const results = data?.results || [];

        if (results.length > 0) {
            displayMovies(results, `${category}`);
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
    titleBannerDiv.classList.add('banner'); // gestion CSS ancre
    const titleBannerImg = document.createElement('img');
    titleBannerImg.src = 'style/banner.jpg';
    titleBannerDiv.appendChild(titleBannerImg);

    header.appendChild(titleBannerDiv);

    const mainContainer = document.querySelector('main');
    mainContainer.appendChild(header);
}


function createSection(title) {
    const section = document.createElement('section');
    section.classList.add('section-container'); // gestion CSS ancre

    const mainContainer = document.querySelector('main');
    mainContainer.appendChild(section);

    const h1 = document.createElement('h1');
    h1.textContent = title; // Titre dynamique
    section.appendChild(h1);

    return section;
}


// LES DISPLAY :


function displayBestMovie(bestMovieData, section) {
    // Créer le conteneur grille pour les éléments du meilleur film
    const container = document.createElement('div');
    container.classList.add('container', 'item-grid');
    
    const bestMovieDiv = document.createElement('div');
    bestMovieDiv.classList.add('best-movie');
    
    // Créer la div 'best-movie' pour les éléments du meilleur film
    const movieImgDiv = document.createElement('div');
    movieImgDiv.classList.add('best-movie-img');
    const movieImg = document.createElement('img');
    movieImg.src = bestMovieData.image_url; // URL dynamique de l'image
    movieImgDiv.appendChild(movieImg);
    
    // Créer le titre du meilleur film avec un <h2> - dynamique
    const movieTitleDiv = document.createElement('div');
    movieTitleDiv.classList.add('best-movie-title');
    const movieTitle = document.createElement('h2');
    movieTitle.textContent = bestMovieData.title; // Titre dynamique du film
    movieTitleDiv.appendChild(movieTitle);
    
    // Créer le résumé du meilleur film film - dynamique
    const movieSummaryDiv = document.createElement('div');
    movieSummaryDiv.classList.add('best-movie-summary');
    
    // Créer <p> pour afficher le résumé du meilleur film - dynamique, avec un texte par défaut si absent
    const movieSummary = document.createElement('p');
    movieSummary.textContent = bestMovieData.description || bestMovieData.long_description || "Résumé non disponible"; 
    // Voir si dans FIGMA, on doit mettre la version courte, et la longue pour Modal.
    movieSummaryDiv.appendChild(movieSummary);
    
    // Créer le bouton "Détails" du meilleur film - url dynamique
    const movieButtonDiv = document.createElement('div');
    movieButtonDiv.classList.add('best-movie-button');
    const movieButton = document.createElement('button');
    movieButton.classList.add('best-movie-details-button');
    movieButton.textContent = 'Détails';
    movieButtonDiv.appendChild(movieButton);
    
    // Lier le bouton à la page de détails avec l'URL dynamique // A REVOIR
    movieButton.addEventListener('click', () => {
        window.location.href = `details.html?movie_id=${bestMovieData.id}`; // URL dynamique avec ID du film
    });
    
    // Ajouter tous les éléments à bestMovieDiv ('best-movie')
    bestMovieDiv.appendChild(movieImgDiv);
    bestMovieDiv.appendChild(movieTitleDiv);
    bestMovieDiv.appendChild(movieSummaryDiv);
    bestMovieDiv.appendChild(movieButtonDiv);
    
    // Ajouter la structure du film au conteneur ('container', 'item-grid')
    container.appendChild(bestMovieDiv);
    
    // Ajouter le conteneur ('container', 'item-grid') à la section générée par createSection
    section.appendChild(container);
}


function displayMovies(movies, sectionTitle) {
    // Gérer affichage Aucun film pour la section
    if (!movies || movies.length === 0) {
        console.warn(`Aucun film trouvé pour la section "${sectionTitle}".`);
        return;
    }

    // Créer la section (appel createSection) et ajouter l'attribut ("data-title") pour l'identifier
    const section = createSection(sectionTitle);
    section.setAttribute("data-title", sectionTitle);

    // Créer le conteneur principal des films
    const container = document.createElement('div');
    container.classList.add('container', 'item-grid');

    // Boucler sur les films et générer leur affichage
    movies.forEach(movie => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item', 'from-third', 'from-fifth');

        const movieImg = document.createElement('img');
        movieImg.src = movie.image_url;  
        movieImg.alt = movie.title;

        const detailDiv = document.createElement('div');
        detailDiv.classList.add('detail');

        const movieTitle = document.createElement('h3');
        movieTitle.textContent = movie.title;

        const detailButton = document.createElement('button');
        detailButton.classList.add('btn');
        detailButton.textContent = "Détails";

        // Event listener pour rediriger vers la page de détails // A REVOIR
        detailButton.addEventListener('click', () => {
            window.location.href = `details.html?movie_id=${movie.id}`;
        });

        // Construction de l'élément
        detailDiv.appendChild(movieTitle);
        detailDiv.appendChild(detailButton);
        itemDiv.appendChild(movieImg);
        itemDiv.appendChild(detailDiv);
        container.appendChild(itemDiv);
    });

    // Ajouter le conteneur des films à la section
    section.appendChild(container);



    // Ajouter le bouton "Voir plus" // FONCTION A SEPARER ET A APPELER ICI // NE S'AFFICHE PAS
    const containerFlex = document.createElement('div');
    containerFlex.classList.add('container', 'container-flex');

    const showMoreButton = document.createElement('button');
    showMoreButton.classList.add('btn', 'btn-show');
    showMoreButton.textContent = "Voir plus";

    containerFlex.appendChild(showMoreButton);
    section.appendChild(containerFlex);
}