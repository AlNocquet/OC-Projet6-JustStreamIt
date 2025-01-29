

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

async function getBestMovie() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    try {
        const data = await makeRequest(apiUrl);

        if (data?.results?.length > 0) {
            const bestMovie = data.results[0];
            const detailedMovie = await fetchMovieDetails(bestMovie.id);

            const section = createSection("Meilleur film");
            section.classList.add('best-movie-section');

            displayBestMovie(detailedMovie, section);
        } else {
            console.log("Aucun film trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du meilleur film :", error);
    }
}


async function getTop6Movies() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7"; 
    try {
        const data = await fetchMovies(apiUrl);

        if (data?.results?.length > 0) {
            // Récupérer le meilleur film (le premier dans le tableau)
            const bestMovie = data.results[0];

            // Exclure le meilleur film, on récupère les 6 suivants
            const filteredMovies = data.results.slice(1, 7); // Prendre les films après le premier

            // Récupérer les détails complets de chaque film pour Modal
            const detailedMoviesPromises = filteredMovies.map(async (movie) => {
                return await fetchMovieDetails(movie.id);
            });
            
            // Attendre que tous les détails des films soient récupérés
            const detailedMovies = await Promise.all(detailedMoviesPromises);

            // Afficher les films
            displayMovies(detailedMovies, "Top films toutes catégories");
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
            // Récupérer les détails complets de chaque film
            const detailedMoviesPromises = results.map(async (movie) => {
                return await fetchMovieDetails(movie.id);
            });
            
            // Attendre que tous les détails des films soient récupérés pour Modal
            const detailedMovies = await Promise.all(detailedMoviesPromises);

            // Afficher les films de la catégorie
            displayMovies(detailedMovies, category);
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


function createShowMoreButton(section) {
    // Créer le conteneur flex pour le bouton
    const containerFlex = document.createElement('div');
    containerFlex.classList.add('container', 'container-flex');

    // Créer le bouton "Voir plus"
    const showMoreButton = document.createElement('button');
    showMoreButton.classList.add('btn', 'btn-show');
    showMoreButton.textContent = "Voir plus";

    // Ajouter le bouton au conteneur
    containerFlex.appendChild(showMoreButton);

    // Ajouter le conteneur à la section
    section.appendChild(containerFlex);
}


function createMovieModal(movieData) {
    // REVOIR LES SEPARATIONS DE RESPONSABILITE AVEC LE BOUTTON CLOSE A APPELER

    console.log("Création du modal avec les données : ", movieData);

    // Création de <section class="modal">
    const modal = document.createElement("section");
    modal.className = "modal";

    // Création de <div class="modal-content">
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Création de <!-- Modal grid content -->
    const modalGrid = document.createElement("div");
    modalGrid.className = "modal-grid-container";

    
    // PARTIE : Informations principales du film

    // Création de <div class="modal-main-infos-movie">
    const mainInfos = document.createElement("div");
    mainInfos.className = "modal-main-infos-movie";

    // 1ère ligne : TITLE
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = movieData.title;
    mainInfos.appendChild(title);

    // 2ème ligne : YEAR et CATEGORY
    const infoRow2 = document.createElement("div");
    infoRow2.className = "info-row";

    const year = document.createElement("div");
    year.className = "year";
    year.textContent = `${movieData.year} -`;  // Ajout du trait d'union
    infoRow2.appendChild(year);

    const category = document.createElement("div");
    category.className = "category";
    category.textContent = movieData.genres.join(", ");
    infoRow2.appendChild(category);

    mainInfos.appendChild(infoRow2);

    // 3ème ligne : AGE-PG, TIME, COUNTRY
    const infoRow3 = document.createElement("div");
    infoRow3.className = "info-row";

    const agePg = document.createElement("div");
    agePg.className = "age-pg";
    // Si la note PG est "Not rated or unkown rating", afficher "N/A" pour gestion espace Modal
    const rating = movieData.rated;
    agePg.textContent = `PG: ${rating === "Not rated or unkown rating" ? "N/A" : rating} -`;  // Ajout du trait d'union
    infoRow3.appendChild(agePg);

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = `${movieData.duration} minutes -`;  // Ajout du trait d'union
    infoRow3.appendChild(time);

    const country = document.createElement("div");
    country.className = "country";
    country.textContent = `${movieData.countries.join(", ") || "N/A"}`;
    infoRow3.appendChild(country);

    mainInfos.appendChild(infoRow3);

    // 4ème ligne : IMDB-SCORE (Ajout manuel / 10)
    const imdbScore = document.createElement("div");
    imdbScore.className = "imdb-score";
    const imdbScoreValue = movieData.imdb_score ? `${movieData.imdb_score} /10` : "N/A"; // (Valeur numérique, si = 0, False > donc pas || )
    imdbScore.textContent = `IMDb Score : ${imdbScoreValue}`;
    mainInfos.appendChild(imdbScore);

    // 5ème ligne : BOX OFFICE (Conversion Dollars)
    const boxOffice = document.createElement("div");
    boxOffice.className = "box-office";
    const boxOfficeValue = movieData.worldwide_gross_income 
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(movieData.worldwide_gross_income) : "N/A";
    // (Valeur numérique, si = 0, False > donc pas || )
    boxOffice.textContent = `Box Office : ${boxOfficeValue}`;
    mainInfos.appendChild(boxOffice);

    // Espace
    const space = document.createElement("div");
    space.className = "space";
    mainInfos.appendChild(space);

    // 6ème ligne : LABEL
    const directorLabel = document.createElement("div");
    directorLabel.className = "label";
    directorLabel.textContent = "Réalisé par :";
    mainInfos.appendChild(directorLabel);

    // 7ème ligne : DIRECTOR
    const director = document.createElement("div");
    director.className = "director";
    director.textContent = movieData.directors.join(", ");
    mainInfos.appendChild(director);

    modalGrid.appendChild(mainInfos);

    // PARTIE : Image du film ; Création de <div class="modal-image-movie"> avec <img src="(En dynamique)" class="modal-img">
    const modalImage = document.createElement("div");
    modalImage.className = "modal-image-movie";
    const img = document.createElement("img");
    img.src = movieData.image_url;
    img.className = "modal-img";
    modalImage.appendChild(img);
    modalGrid.appendChild(modalImage);

    // PARTIE : Résumé ; Création de <span class="modal-summary"> (En dynamique)
    const modalSummary = document.createElement("span");
    modalSummary.className = "modal-summary";
    modalSummary.textContent = movieData.long_description || "Résumé non disponible";
    modalGrid.appendChild(modalSummary);

    // PARTIE : Acteurs ; Création de <span class="modal-with"> avec <span class="modal-actors"> (En dynamique)
    const modalWith = document.createElement("span");
    modalWith.className = "modal-with";
    modalWith.textContent = "Avec :";
    modalGrid.appendChild(modalWith);

    const modalActors = document.createElement("span");
    modalActors.className = "modal-actors";
    modalActors.textContent = `${movieData.actors.join(", ")}`;
    modalGrid.appendChild(modalActors);

    modalContent.appendChild(modalGrid);

    // PARTIE : Bouton de fermeture <div class="container container-flex"> avec <button class="btn-close">Fermer</button>
    const btnContainer = document.createElement("div");
    btnContainer.className = "container container-flex";

    const btnClose = document.createElement("button");
    btnClose.className = "btn-close";
    btnClose.textContent = "Fermer";
    btnClose.addEventListener("click", () => {
        modal.remove();
    });
    // Ajout du bouton à <div class="container container-flex">
    btnContainer.appendChild(btnClose);

    // Ajout de <div class="container container-flex"> à <div class="modal-content">
    modalContent.appendChild(btnContainer);
    // Ajout de <div class="modal-content"> à <section class="modal">
    modal.appendChild(modalContent);

    // Ajout du modal au body
    document.body.appendChild(modal);
    modal.style.display = 'block'; // Force l'affichage du modal qui en en display none par défaut en CSS
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
    
    // Lier le bouton à l'ouverture du modal
    movieButton.addEventListener('click', () => {
        createMovieModal(bestMovieData); // Appel de la fonction qui crée le modal
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

        // Lier le bouton à l'ouverture du modal
        detailButton.addEventListener('click', () => {
            console.log('Le bouton Détails a été cliqué');
            createMovieModal(movie);  // Appel de la fonction qui crée le modal
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

    // Appeler fonction createShowMoreButton pour bouton "Voir plus"
    createShowMoreButton(section);
}


