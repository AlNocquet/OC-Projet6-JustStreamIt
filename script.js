
// Single Responsibility Principle (SRP) :

// FETCH : Récupération des données de l’API ;
// CHECK : Gestion des erreurs HTTP centralisée ;
// GET : Responsabilité de la logique métier, orchestration ;
// CREATE : création dynamique du HTML ;
// DISPLAY : Affichage des datas.


// FETCH ET CHECK :

// Récupère une liste de films depuis une URL donnée
async function fetchMovies(apiUrl) {
    return await makeRequest(apiUrl);
}

// Effectue la requête HTTP et gère la conversion en JSON + vérification des erreurs
async function makeRequest(apiUrl) {
    const response = await fetch(apiUrl);

    await checkResponseStatus(response);

    return response.json(); 
}

// Vérifie le statut HTTP et lève une erreur en cas de problème
async function checkResponseStatus(response) {
    if (response.status === 404) {
        throw new Error("Ressource non trouvée (404)");
    } else if (response.status >= 500) {
        throw new Error("Erreur serveur, veuillez réessayer plus tard");
    } else if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
}

// Récupère les 6 meilleurs films d’une catégorie donnée
async function fetchMoviesByCategory(category) {
    // Encodage valide caractères spéciaux et espaces :
    const apiUrl = `http://localhost:8000/api/v1/titles/?genre=${encodeURIComponent(category)}&sort_by=-imdb_score&page_size=6`;
    return await fetchMovies(apiUrl);
}

// Récupère toutes les catégories de films disponibles (gestion de la pagination) ; API : "v1/genres/"
    // Appel dans createOtherCategory() pour <select>
    // Appel dans getTop6MoviesByCategory() pour les catégories existantes
async function fetchAllGenres() {
    try {
        let allGenres = [];
        let nextPageUrl = "http://localhost:8000/api/v1/genres/";
    
        while (nextPageUrl) {
            const response = await fetch(nextPageUrl);
    
            // Vérification du statut :
            await checkResponseStatus(response);
    
            const data = await response.json();
            allGenres = allGenres.concat(data.results);
            nextPageUrl = data.next || null;
        }
    
        return allGenres;
            
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return [];
    }
}

// Récupère les détails d’un film spécifique via son ID ; API : "/v1/titles/"
async function fetchMovieDetails(movieId) {
    const apiUrl = `http://localhost:8000/api/v1/titles/${movieId}`;
    const movieDetails = await makeRequest(apiUrl);
    
    return movieDetails;
}



// LES GETS :

// Récupère le meilleur film (le premier film trié par score IMDb) et affiche ses détails
async function getBestMovie() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    try {
        const data = await fetchMovies(apiUrl);

        if (data?.results?.length > 0) {
            // Récupérer le meilleur film (le premier dans le tableau) :
            const bestMovie = data.results[0];
            // Récupérer les détails du meilleur film :
            const detailedMovie = await fetchMovieDetails(bestMovie.id);

            const section = createSection("Meilleur film");
            section.classList.add('best-movie-section');

            // Afficher :
            displayBestMovie(detailedMovie, section);

        } else {
            console.log("Aucun film trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du meilleur film :", error);
    }
}


// Récupère les 6 meilleurs films (après le meilleur film) triés par score IMDb et affiche leurs détails
async function getTop6Movies() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7"; 
    try {
        const data = await fetchMovies(apiUrl);

        if (data?.results?.length > 0) {
            const bestMovie = data.results[0];
            // Exclure le meilleur film, récupérer les 6 suivants :
            const filteredMovies = data.results.slice(1, 7);
            // Récupérer les détails de chaque film pour Modal :
            const detailedMoviesPromises = filteredMovies.map(async (movie) => {
                return await fetchMovieDetails(movie.id);
            });
            
            // Attendre TOUS les détails de TOUS les films pour Modal :
            const detailedMovies = await Promise.all(detailedMoviesPromises);

            // Afficher :
            displayMovies(detailedMovies, "Top films toutes catégories");
        } else {
            console.log("Aucun film trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des 6 meilleurs films :", error);
    }
}


// Récupère les 6 meilleurs films d'une catégorie donnée dans main.js et affiche leurs détails.
async function getTop6MoviesByCategory(category) {
    try {
        // Définir toutes les catégories disponibles dans l'API:
        const allGenres = await fetchAllGenres();

        // Définir les 6 meilleurs films d’une catégorie :
        const data = await fetchMoviesByCategory(category);
        const results = data?.results || [];

        if (results.length > 0) {
            // Récupérer les détails complets de chaque film :
            const detailedMoviesPromises = results.map(async (movie) => {
                return await fetchMovieDetails(movie.id);
            });
            
            // Attendre TOUS les détails de TOUS les films pour Modal :
            const detailedMovies = await Promise.all(detailedMoviesPromises);

            // Afficher les 6 meilleurs films de la catégorie :
            displayMovies(detailedMovies, category);

        } else {
            console.log(`Aucun film trouvé pour la catégorie ${category}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des films pour la catégorie ${category} :`, error);
    }
}



// LES DISPLAY :

// Affiche les informations du meilleur film dans une section :
function displayBestMovie(bestMovieData, section) {

    // Créer la div 'container item-grid':
    const container = document.createElement('div');
    container.classList.add('container', 'item-grid');

    // Créer la div 'best-movie' :
    const bestMovieDiv = document.createElement('div');
    bestMovieDiv.classList.add('best-movie');

    // Ajouter les éléments dynamiques : ( Entrées : Titre, Img, Résumé, Bouton "Détails")
    bestMovieDiv.append(
        createMovieImage(bestMovieData.image_url),
        createMovieTitle(bestMovieData.title),
        createMovieSummary(bestMovieData.description),
        createMovieButton(bestMovieData)
    );

    // Ajouter la div 'best-movie' à 'container item-grid' :
    container.appendChild(bestMovieDiv);

    // Ajouter 'container item-grid' à <section> (createSection()) :
    section.appendChild(container);
}


// Affiche les informations de films dans une section (Entrées : Titre de section (sectionTitle) ; tableau de films (movies))
function displayMovies(movies, sectionTitle, container = null) {
    // Entrées des films : Titre, Img, Bouton "Détails" (> Ouverture Modal)
    // Section : MEDIA QUERIES - Bouton "Voir Plus"

    if (!movies || movies.length === 0) {
        console.warn(`Aucun film trouvé pour la section "${sectionTitle}".`);
        return;
    }

    // Obtenir ou créer la section avec titre :
    let section = getOrCreateSection(sectionTitle);
    // Obtenir ou créer le conteneur :
    container = getOrCreateContainer(section, container);

    // Création <div class="movies-border-wrapper"> pour ajouter une bordure :
    let borderWrapper = document.createElement("div");
    borderWrapper.classList.add("movies-border-wrapper");

    // Ajouter <div class="movies-border-wrapper"> à la section AVANT le container des films :
    section.appendChild(borderWrapper);
    
    // Ajouter <div class="movies-border-wrapper"> au conteneur :
    borderWrapper.appendChild(container);

    // Pour chaque film, créer et ajouter l'objet html au conteneur :
    movies.forEach(movie => {
        const itemDiv = createMovieItem(movie);
        container.appendChild(itemDiv);
    });

    // Ajouter le bouton "Voir plus" :
    createShowButton(section);

    // Ajouter la section à la page :
    appendSectionToPage(section);
}


// Ajoute la section dans le DOM si elle n'existe pas déjà (<main class="main-container">)
function appendSectionToPage(section) {
    if (!section.parentElement) {
        document.querySelector('.main-container').appendChild(section);
    }
}


// LES CREATE :

// Créer <header>
function createHeader() {
    const header = document.createElement('header');

    const titleBannerDiv = document.createElement('div');
    titleBannerDiv.classList.add('banner');
    const titleBannerImg = document.createElement('img');
    titleBannerImg.src = 'style/banner.jpg'; // valeur par défaut
    titleBannerDiv.appendChild(titleBannerImg);

    header.appendChild(titleBannerDiv);

    const mainContainer = document.querySelector('main');
    mainContainer.appendChild(header);

    // Media Queries Mobile :
    updateBannerImage();
    // MAJ suite redimensionnement de la fenêtre
    window.addEventListener('resize', updateBannerImage);
}

// Gérer le logo selon DESKTOP & TABLET vs MOBILE
function updateBannerImage() {
    const bannerImg = document.querySelector('header .banner img');
    if (window.matchMedia("(max-width: 767px)").matches) {
        bannerImg.src = 'style/logo.jpg';
    } else {
        bannerImg.src = 'style/banner.jpg';
    }
}

// Créer <section>
function createSection(title) {
    const section = document.createElement('section');
    section.classList.add('section-container');

    const mainContainer = document.querySelector('main');
    mainContainer.appendChild(section);

    const h1 = document.createElement('h1');
    h1.textContent = title; // Titre dynamique
    section.appendChild(h1);

    return section;
}


// Vérifier ou créer une section avec titre Nom Catégorie (Gestion doublon DisplayMovies())
function getOrCreateSection(sectionTitle) {
    const existingSection = document.querySelector(`section[data-title="${sectionTitle}"]`);

    if (existingSection) {
        return existingSection;

    } else {
        const section = createSection(sectionTitle);
        // Identifier avec un attribut "data-title" (Nom Catégorie)
        section.setAttribute("data-title", sectionTitle);
        return section;
    }
}


// Récupérer ou créer le conteneur <container item-grid> des films (Gestion doublon DisplayMovies())
function getOrCreateContainer(section, container) {
    if (!container) {
        container = document.createElement('div');
        container.classList.add('container', 'item-grid');
        section.appendChild(container);

    } else {
        container = section.querySelector('.container');
    }
    return container;
}


// (displayBestMovie()) Créer <div class="best-movie-img"> :
function createMovieImage(imageUrl) {
    // Création d'un conteneur pour l'image :
    const movieImgDiv = document.createElement('div');
    movieImgDiv.classList.add('best-movie-img');
  
    // <img> :
    const movieImg = document.createElement('img');
  
    // Définir une image de fallback par défaut :
    const defaultImage = 'style/image-not-found.jpg';
  
    // Attribuer le src avec vérification de l'URL, sinon utiliser l'image par défaut :
    movieImg.src = (imageUrl && imageUrl.trim() !== '') ? imageUrl : defaultImage;

    // Attacher l'événement onerror à movieImg en cas d'erreur :
    movieImg.onerror = () => {
      movieImg.src = defaultImage;
    };
  
    // Ajouter l'image à <div class="best-movie-img"> :
    movieImgDiv.appendChild(movieImg);
  
    return movieImgDiv;
}


// (displayBestMovie()) Créer la div 'best-movie-title' - avec <h2> dynamique :
function createMovieTitle(title) {
    const movieTitleDiv = document.createElement('div');
    movieTitleDiv.classList.add('best-movie-title');
    
    const movieTitle = document.createElement('h2');
    movieTitle.textContent = title; // Titre dynamique
    
    movieTitleDiv.appendChild(movieTitle);
    return movieTitleDiv;
}

// (displayBestMovie()) Créer la div 'best-movie-summary' - dynamique (avec un texte par défaut si absent) :
function createMovieSummary(description) {
    const movieSummaryDiv = document.createElement('div');
    movieSummaryDiv.classList.add('best-movie-summary');
    
    const movieSummary = document.createElement('p');
    movieSummary.textContent = description || "Résumé non disponible"; // Résumé dynamique
    
    movieSummaryDiv.appendChild(movieSummary);
    return movieSummaryDiv;   
}


// (DisplayMovies()) Créer un élément représentant un film :
function createMovieItem(movie) {

    // <div 'item'> (Un film):
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    // Img (Définir une image de fallback par défaut):
    const movieImg = document.createElement('img');
    movieImg.src = movie.image_url;
    movieImg.alt = movie.title;
    const defaultImage = 'style/image-not-found.jpg';
  
    // Img : Attribuer le src avec vérification de l'URL, sinon utiliser l'image par défaut :
    movieImg.src = (movie.image_url && movie.image_url.trim() !== '') ? movie.image_url : defaultImage;
    movieImg.alt = movie.title;
  
    // Attacher l'événement onerror à movieImg en cas d'erreur :
    movieImg.onerror = () => {
        movieImg.src = defaultImage;
    };

    // Détails (Zone grise Détails contenant : Titre h3 dynamique ; Bouton détails pour Modal) :
    const detailDiv = document.createElement('div');
    detailDiv.classList.add('detail');

    // h3
    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.title;

    const detailButton = document.createElement('button');
    detailButton.classList.add('btn');
    detailButton.textContent = "Détails";

    // EventListener > ouverture du modal
    detailButton.addEventListener('click', () => {
        createMovieModal(movie); // Appel de la fonction création Modal
    });

    // Ajouter h3 et boutton détails à <div class ="détails" > :
    detailDiv.appendChild(movieTitle);
    detailDiv.appendChild(detailButton);

    // Ajouter Img à <div class ="item"> :
    itemDiv.appendChild(movieImg);

    // Ajouter Zone détails à <div class ="item"> :
    itemDiv.appendChild(detailDiv);

    return itemDiv;
}

// (displayBestMovie()) Créer le bouton "Détails" > Ouverture Modal :
function createMovieButton(movieData) {
    const movieButtonDiv = document.createElement('div');
    movieButtonDiv.classList.add('best-movie-button');
    
    const movieButton = document.createElement('button');
    movieButton.classList.add('best-movie-details-button');
    movieButton.textContent = 'Détails';
    
    // Ajout de l'EventListener pour afficher le modal
    movieButton.addEventListener('click', () => createMovieModal(movieData)); 
    
    movieButtonDiv.appendChild(movieButton);
    return movieButtonDiv;
}


// CATEGORIE A CHOIX :

// Fonction principale : Afficher les films selon la catégorie sélectionnée.
async function getTop6Movies_OthersCategories() {

    // Appel : crée la structure de la section avec ses éléments internes :
    const section = buildOtherCategorySection();

    // Ajoute <section class="section-container" data-title="Autres catégories"> à <main class="main-container">:
    document.querySelector(".main-container").appendChild(section);
  
    // Récupère le <select> et le conteneur ".container.item-grid" (conteneur d'un film) :
    const select = section.querySelector("select");
    const moviesContainer = section.querySelector(".container.item-grid");
  
    // Remplit le <select> avec les catégories dans les <options> depuis l'API :
    await populateGenreOptions(select);
  
    // addEventListener : MAJ des films lors de changement de la catégorie par l'utilisateur :
    select.addEventListener("change", () => {
      updateMoviesForGenre(select, section, moviesContainer);
    });
  
    // Si <select> contient <options>, déclenche un événement de changement :
    if (select.options.length > 0) {
      select.dispatchEvent(new Event("change"));
    }

    createShowButton(section);
}

// Créer HTML de la section "Autres catégories" (sans createSection, createContainer = conflit) :
function buildOtherCategorySection() {

    // <section class="section-container" data-title="Autres catégories"> :
    const section = document.createElement("section");
    section.classList.add("section-container");
    section.setAttribute("data-title", "Autres catégories");
  
    // <div class="top-row"> (pour aligner h1 et <select>) :
    const topRow = document.createElement("div");
    topRow.classList.add("top-row");
  
    // <h1> Autres : (non dynamique) </h1> :
    const h1 = document.createElement("h1");
    h1.textContent = "Autres :";
    topRow.appendChild(h1);
  
    // <div class="custom-select"> dans <div class="top-row"> pour gérer petit icone vert dans <select>:
    const customSelectContainer = document.createElement("div");
    customSelectContainer.classList.add("custom-select");
    const select = document.createElement("select");
  
    // <select> (<select class="side-by-side-select">) dans <div class="top-row"> :
    select.classList.add("side-by-side-select");
    customSelectContainer.appendChild(select);
    topRow.appendChild(customSelectContainer);

    // Ajout <div class="top-row"> à <section class="section-container" data-title="Autres catégories"> :
    section.appendChild(topRow);
  
    // <div class="selection"> pour contenir <div class="container item-grid"> * 6 (films) :
    const selectionDiv = document.createElement("div");
    selectionDiv.classList.add("selection");
    section.appendChild(selectionDiv);
    
    const moviesContainer = document.createElement("div");
    moviesContainer.classList.add("container", "item-grid");
    selectionDiv.appendChild(moviesContainer);
    
    return section;
}

// Récupère les genres via fetchAllGenres() et ajoute chaque genre dans <select>
async function populateGenreOptions(select) {
    let genres = [];

    try {
        // Appel, récupérer catégories depuis API :
        genres = await fetchAllGenres();
    } catch (error) {
        console.error("Erreur lors de la récupération des genres :", error);
    }

    // Exclure "Sci-Fi" et "Fantasy":
    const excludedCategories = ["Sci-Fi", "Fantasy"];
    // TRUE si trouvé /FALSE sinon; inverse (!) pour garder uniquement les genres qui ne sont pas dans excludedCategories :
    const filteredGenres = genres.filter(genre => !excludedCategories.includes(genre.name));

    // Pour chaque genre (filtré), crée une <option> et l'ajoute à <select> :
    filteredGenres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.name;
        option.textContent = genre.name;
        select.appendChild(option);
    });
}

// MAJ du conteneur des films en fonction du genre sélectionné
async function updateMoviesForGenre(select, section, moviesContainer) {

    // Vider le conteneur des films :
    moviesContainer.innerHTML = "";
  
    // Récupérer le genre sélectionné et met à jour l'attribut "data-title" de la section :
    const selectedCategory = select.value;
    section.setAttribute("data-title", selectedCategory);
  
    try {
      // Récupérer les films correspondant au genre sélectionné via l'API :
      const data = await fetchMoviesByCategory(selectedCategory);
      const results = data?.results || [];
  
      if (results.length > 0) {
        // Appel, Récupérer les détails complets pour chaque film :
        const detailedMoviesPromises = results.map(async (movie) =>
          await fetchMovieDetails(movie.id)
        );
        // Attendre que toutes les promesses soient résolues :
        const detailedMovies = await Promise.all(detailedMoviesPromises);
  
        // Pour chaque film détaillé, crée <div class="item"> et l'ajoute à <div class='container item-grid'> :
        detailedMovies.forEach((movie) => {
          const itemDiv = createMovieItem(movie);
          moviesContainer.appendChild(itemDiv);
        });

        createShowButton(section)

      } else {
        // Afficher un message si aucun film trouvé pour la catégorie :
        moviesContainer.innerHTML = "<p>Aucun film trouvé pour cette catégorie.</p>";
      }

    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
    }
}


// MODAL : 

// Fonction principale de création et d'affichage du modal :
function createMovieModal(movieData) {

    const modal = createModalSection(); // <section class="modal">
    const modalContent = createModalContent(); // <div class="modal-content">

    // <div class="modal-grid-container"> :
    const modalGrid = createModalGrid();
    // Ajout des différentes sections dans le modalGrid :
    modalGrid.appendChild(createModalCloseButton_X(modal)); // Icone X pour fermer le modal
    modalGrid.appendChild(createModalMainInfos(movieData)); // Informations principales du film
    modalGrid.appendChild(createModalMovieImage(movieData)); // Image du film
    modalGrid.appendChild(createModalMovieSummary(movieData)); // Résumé du film
    modalGrid.appendChild(createModalActorsSection(movieData)); // Acteurs du film

    // Ajout de <div class="modal-grid-container"> à <div class="modal-content">
    modalContent.appendChild(modalGrid);

    // Ajout de <div class="container container-flex"> à <div class="modal-content"> :
    modalContent.appendChild(createModalCloseButton(modal)); // Bouton pour fermer le modal

    // Ajout des éléments à <section class="modal"> :
    modal.appendChild(modalContent);

    // Ajout de <section class="modal"> au body :
    document.body.appendChild(modal);
    modal.style.display = 'flex'; // Force l'affichage du modal qui est en display none par défaut en CSS
}

// Création de <section class="modal">
function createModalSection() {
    const modal = document.createElement("section");
    modal.className = "modal";
    return modal;
}

// Création de <div class="modal-content">
function createModalContent() {
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    return modalContent;
}

// Création de <div class="modal-grid-container">
function createModalGrid() {
    const modalGrid = document.createElement("div");
    modalGrid.className = "modal-grid-container";
    return modalGrid;
}

// Création de la partie des informations principales du film :
function createModalMainInfos(movieData) {

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
    year.textContent = `${movieData.year} -`; // Ajout du trait d'union
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
    const rating = movieData.rated;
    // Si la note PG est "Not rated or unkown rating", afficher "N/A" pour gestion espace Modal
    agePg.textContent = `PG: ${rating === "Not rated or unkown rating" ? "N/A" : rating} -`;  
    infoRow3.appendChild(agePg);

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = `${movieData.duration} minutes -`;  
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

    // 5ème ligne : BOX OFFICE
    const boxOffice = document.createElement("div");
    boxOffice.className = "box-office";
    const boxOfficeValue = movieData.worldwide_gross_income 
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(movieData.worldwide_gross_income) 
        : "N/A";
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

    return mainInfos;
}

// Création de la partie de l'image du film :
function createModalMovieImage(movieData) {

    // <div class="modal-image-movie"> :
    const modalImage = document.createElement("div");
    modalImage.className = "modal-image-movie";
  
    const img = document.createElement("img");
    const defaultImage = 'style/image-not-found-modal.jpg';
  
    // Attribution de l'URL de l'image si valide, sinon utilisation de l'image par défaut :
    img.src = movieData.image_url && movieData.image_url.trim() !== '' ? movieData.image_url : defaultImage;
    img.className = "modal-img";
  
    // Gestionnaire d'erreur : si le chargement de l'image échoue, utiliser l'image par défaut :
    img.onerror = () => {
        img.src = defaultImage;
    };
  
    modalImage.appendChild(img);

    return modalImage;
}

// Création de la partie Résumé du film :
function createModalMovieSummary(movieData) {

    // <span class="modal-summary"> (En dynamique)
    const modalSummary = document.createElement("span");
    modalSummary.className = "modal-summary";
    // Si résumé existe (TRUE) et n'est pas une chaîne vide après trim, égal à movieData.long_description :
    modalSummary.textContent = (movieData.long_description && movieData.long_description.trim()) 
        ? movieData.long_description 
        : "Résumé non disponible"; // Sinon message "Résumé non disponible"
    return modalSummary;
}

// Création de la partie des acteurs du film :
function createModalActorsSection(movieData) {

    // <span class="modal-with"> avec <span class="modal-actors"> (En dynamique)
    const actorsContainer = document.createDocumentFragment();

    const modalWith = document.createElement("span");
    modalWith.className = "modal-with";
    modalWith.textContent = "Avec :";
    actorsContainer.appendChild(modalWith);

    const modalActors = document.createElement("span");
    modalActors.className = "modal-actors";
    modalActors.textContent = `${movieData.actors.join(", ")}`;
    actorsContainer.appendChild(modalActors);

    return actorsContainer;
}

// Création du bouton de fermeture (Desktop)
function createModalCloseButton(modal) {

    // <div class="container container-flex"> :
    const btnContainer = document.createElement("div");
    btnContainer.className = "container container-flex";

    // <button class="btn-close">Fermer</button> :
    const btnClose = document.createElement("button");
    btnClose.className = "btn-close";
    btnClose.textContent = "Fermer";

    btnClose.addEventListener("click", () => {
        modal.remove();
    });

    btnContainer.appendChild(btnClose);
    return btnContainer;
}

// Création du bouton de fermeture (Tablette/Mobile)
function createModalCloseButton_X(modal) {

    // <div class="container container-flex-MQ"> :
    const mobileContainer = document.createElement("div");
    mobileContainer.className = "container container-flex-MQ";
    
    // <span class="icon-close"> Icone X (CSS) </span> :
    const iconClose = document.createElement("span");
    iconClose.className = "icon-close"; 
  
    // addEventListener Fermeture Modal avec X :
    iconClose.addEventListener("click", () => {
        modal.remove();
    });
  
    mobileContainer.appendChild(iconClose);
    return mobileContainer;
}


// MEDIA QUERIES - Tablette et Mobile

// Création et fonction du bouton "Voir plus" / "Voir moins":
function createShowButton(section) {
  // Récupérer tous les films de la catégorie <class="item"> :
  const items = section.querySelectorAll('.item');

  // Créer le conteneur et le bouton
  const containerFlex = document.createElement('div');
  containerFlex.classList.add('container', 'container-flex');

  const button = document.createElement('button');
  button.classList.add('btn-show');
  button.textContent = 'Voir plus';

  containerFlex.appendChild(button);
  section.appendChild(containerFlex);

  // MatchMedia (responsive sans reload)
  const mqMobile  = window.matchMedia('(max-width: 767px)');
  const mqTablet  = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');
  const mqDesktop = window.matchMedia('(min-width: 1281px)');

  function mode() {
    if (mqMobile.matches) return 'mobile';
    if (mqTablet.matches) return 'tablet';
    return 'desktopLike'; // >=1025 hors tablette stricte (y compris ≥1281)
  }

  function showRange(start, end) {
    for (let i = start; i < end && i < items.length; i++) {
      items[i].classList.remove('hidden');
    }
  }
  function hideRange(start, end) {
    for (let i = start; i < end && i < items.length; i++) {
      items[i].classList.add('hidden');
    }
  }
  function showAll() { items.forEach(el => el.classList.remove('hidden')); }

  let expanded = false;

  function applyState() {
    const m = mode();

    if (m === 'mobile') {
      // Repli par défaut : cacher items 3..6 (indices 2..5)
      hideRange(2, 6);
      // Bouton visible si quelque chose est caché
      const hiddenCount = Array.from(items).slice(2, 6).filter(el => el.classList.contains('hidden')).length;
      if (hiddenCount > 0) {
        button.classList.remove('hidden');
        button.textContent = expanded ? 'Voir moins' : 'Voir plus';
      } else {
        button.classList.add('hidden');
      }
    } else if (m === 'tablet') {
      // Repli par défaut : cacher items 5..6 (indices 4..5)
      hideRange(4, 6);
      const hiddenCount = Array.from(items).slice(4, 6).filter(el => el.classList.contains('hidden')).length;
      if (hiddenCount > 0) {
        button.classList.remove('hidden');
        button.textContent = expanded ? 'Voir moins' : 'Voir plus';
      } else {
        button.classList.add('hidden');
      }
    } else {
      // Desktop-like : tout afficher et bouton masqué
      showAll();
      button.classList.add('hidden'); // En plus, ton CSS masque ≥1281px
      expanded = false;               // état neutre
    }
  }

  // Etat initial selon le viewport courant (même si la page a été chargée en desktop)
  applyState();

  // S'adapter à la vue adaptive sans recharger
  [mqMobile, mqTablet, mqDesktop].forEach(mq => {
    mq.addEventListener('change', () => {
      // Quand on change de breakpoint, on repasse en état replié par défaut (si mobile/tablet)
      expanded = false;
      applyState();
    });
  });

  // Toggle au clic
  button.addEventListener('click', function () {
    const m = mode();
    if (!expanded) {
      if (m === 'mobile') {
        // Afficher 3..6
        showRange(2, 6);
      } else if (m === 'tablet') {
        // Afficher 5..6
        showRange(4, 6);
      }
      button.textContent = 'Voir moins';
      expanded = true;
    } else {
      if (m === 'mobile') {
        hideRange(2, 6);
      } else if (m === 'tablet') {
        hideRange(4, 6);
      }
      button.textContent = 'Voir plus';
      expanded = false;
      section.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  });

  // Compatibilité avec appelant existant
  return button;
}

