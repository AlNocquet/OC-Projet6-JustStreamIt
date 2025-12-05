
// FETCH ET CHECK :


/**
 * Fetches a list of movies from the API using the provided URL.
 * Delegates the HTTP logic and error handling to makeRequest.
 *
 * @async
 * @param {string} apiUrl - Absolute URL of the OCMovies API endpoint.
 * @returns {Promise<Object>} Resolves to the parsed JSON response containing movie data.
 */
async function fetchMovies(apiUrl) {
    return await makeRequest(apiUrl);
}


/**
 * Performs an HTTP GET request and converts the response to JSON
 * after validating the HTTP status code.
 *
 * @async
 * @param {string} apiUrl - Absolute URL to request.
 * @returns {Promise<Object>} Resolves to the parsed JSON body of the response.
 * @throws {Error} Throws if the HTTP status indicates an error.
 */
async function makeRequest(apiUrl) {
    const response = await fetch(apiUrl);

    await checkResponseStatus(response);

    return response.json(); 
}


/**
 * Validates an HTTP response and throws a descriptive error
 * for 404, 5xx, or any non-OK status.
 *
 * @async
 * @param {Response} response - Fetch API response object to validate.
 * @throws {Error} Throws an error describing the HTTP failure.
 */
async function checkResponseStatus(response) {
    if (response.status === 404) {
        throw new Error("Ressource non trouvée (404)");
    } else if (response.status >= 500) {
        throw new Error("Erreur serveur, veuillez réessayer plus tard");
    } else if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
}


/**
 * Fetches the top movies for a given genre from the OCMovies API,
 * sorted by descending IMDb score and limited to 6 results.
 *
 * @async
 * @param {string} category - Movie genre name to filter by.
 * @returns {Promise<Object>} Resolves to the JSON payload containing the movies.
 */
async function fetchMoviesByCategory(category) {

    const apiUrl = `http://localhost:8000/api/v1/titles/?genre=${encodeURIComponent(category)}&sort_by=-imdb_score&page_size=6`;
    return await fetchMovies(apiUrl);
}


/**
 * Fetches all available movie genres from the OCMovies API,
 * following pagination until all pages have been retrieved.
 *
 * @async
 * @returns {Promise<Object[]>} Resolves to an array of genre objects.
 */
async function fetchAllGenres() {
    try {
        let allGenres = [];
        let nextPageUrl = "http://localhost:8000/api/v1/genres/";
    
        while (nextPageUrl) {
            const response = await fetch(nextPageUrl);
    
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


/**
 * Fetches complete details for a single movie by its identifier.
 *
 * @async
 * @param {number|string} movieId - Identifier of the movie to fetch.
 * @returns {Promise<Object>} Resolves to the detailed movie object.
 */
async function fetchMovieDetails(movieId) {
    const apiUrl = `http://localhost:8000/api/v1/titles/${movieId}`;
    const movieDetails = await makeRequest(apiUrl);
    
    return movieDetails;
}



// GET :


/**
 * Retrieves the highest rated movie across all categories and
 * renders its details in the "Best movie" section.
 *
 * @async
 * @returns {Promise<void>}
 */
async function getBestMovie() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    try {
        const data = await fetchMovies(apiUrl);

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


/**
 * Retrieves the top-rated movies across all categories, excluding the
 * very best one, and displays the next 6 movies in a dedicated section.
 * Also fetches full details for each movie to support the modal.
 *
 * @async
 * @returns {Promise<void>}
 */
async function getTop6Movies() {
    const apiUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7"; 
    try {
        const data = await fetchMovies(apiUrl);

        if (data?.results?.length > 0) {
            const filteredMovies = data.results.slice(1, 7);
            const detailedMoviesPromises = filteredMovies.map(async (movie) => {
                return await fetchMovieDetails(movie.id);
            });
            
            const detailedMovies = await Promise.all(detailedMoviesPromises);

            displayMovies(detailedMovies, "Films les mieux notés");
        } else {
            console.log("Aucun film trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des 6 meilleurs films :", error);
    }
}


/**
 * Retrieves and displays the top 6 movies for the given category.
 * Fetches details for each movie so they can be shown in a modal.
 *
 * @async
 * @param {string} category - Name of the category (e.g. "Fantasy", "Sci-Fi").
 * @returns {Promise<void>}
 */
async function getTop6MoviesByCategory(category) {
    try {
        const allGenres = await fetchAllGenres();

        const data = await fetchMoviesByCategory(category);
        const results = data?.results || [];

        if (results.length > 0) {
            const detailedMoviesPromises = results.map(async (movie) => {
                return await fetchMovieDetails(movie.id);
            });
            
            const detailedMovies = await Promise.all(detailedMoviesPromises);

            displayMovies(detailedMovies, category);

        } else {
            console.log(`Aucun film trouvé pour la catégorie ${category}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des films pour la catégorie ${category} :`, error);
    }
}


/**
 * Builds the “Other categories” section with a dynamic <select> and
 * loads the top 6 movies for the initially selected genre.
 * Also wires the category change handler and the “Show more / less” button.
 *
 * @async
 * @returns {Promise<void>}
 */
async function getTop6Movies_OthersCategories() {

    const section = buildOtherCategorySection();
    document.querySelector(".main-container").appendChild(section);
  
    const select = section.querySelector("select");
    const moviesContainer = section.querySelector(".container.item-grid");
  
    await populateGenreOptions(select);
  
    select.addEventListener("change", () => {
      updateMoviesForGenre(select, section, moviesContainer);
    });
  
    if (select.options.length > 0) {
      select.dispatchEvent(new Event("change"));
    }

    createShowButton(section);
}


// Additional code that complements the previous section OthersCategories:
    // function buildOtherCategorySection()
    // async function populateGenreOptions(select)
    // async function updateMoviesForGenre(select, section, moviesContainer)


/**
 * Creates the full DOM structure for the “Other categories” section,
 * including the title, dropdown selector, and empty movies container.
 *
 * @returns {HTMLElement} The constructed section element for other categories.
 */
function buildOtherCategorySection() {

    const section = document.createElement("section");
    section.classList.add("section-container");
    section.setAttribute("data-title", "Autres catégories");
  
    const topRow = document.createElement("div");
    topRow.classList.add("top-row");
  
    const customSelectContainer = document.createElement("div");
    customSelectContainer.classList.add("custom-select");
    const select = document.createElement("select");
  
    select.classList.add("side-by-side-select");
    customSelectContainer.appendChild(select);
    topRow.appendChild(customSelectContainer);

    section.appendChild(topRow);
  
    const selectionDiv = document.createElement("div");
    selectionDiv.classList.add("selection");
    section.appendChild(selectionDiv);
    
    const moviesContainer = document.createElement("div");
    moviesContainer.classList.add("container", "item-grid");
    selectionDiv.appendChild(moviesContainer);
    
    return section;

}


/**
 * Populates a <select> element with movie genres fetched from the API,
 * excluding the genres already used in predefined sections (e.g. Sci-Fi, Fantasy).
 *
 * @async
 * @param {HTMLSelectElement} select - Select element to be filled with <option> entries.
 * @returns {Promise<void>}
 */
async function populateGenreOptions(select) {
    let genres = [];

    try {
        genres = await fetchAllGenres();
    } catch (error) {
        console.error("Erreur lors de la récupération des genres :", error);
    }

    const excludedCategories = ["Sci-Fi", "Fantasy"];
    const filteredGenres = genres.filter(genre => !excludedCategories.includes(genre.name));

    filteredGenres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.name;
        option.textContent = genre.name;
        select.appendChild(option);
    });
}


/**
 * Refreshes the movies grid for the “Other categories” section according
 * to the currently selected genre in the dropdown.
 *
 * @async
 * @param {HTMLSelectElement} select - Select element containing the chosen genre.
 * @param {HTMLElement} section - Section whose title and content are updated.
 * @param {HTMLElement} moviesContainer - Container element where movie cards are rendered.
 * @returns {Promise<void>}
 */
async function updateMoviesForGenre(select, section, moviesContainer) {

    moviesContainer.innerHTML = "";
  
    const selectedCategory = select.value;
    section.setAttribute("data-title", selectedCategory);
  
    try {

      const data = await fetchMoviesByCategory(selectedCategory);
      const results = data?.results || [];
  
      if (results.length > 0) {

        const detailedMoviesPromises = results.map(async (movie) =>
          await fetchMovieDetails(movie.id)
        );

        const detailedMovies = await Promise.all(detailedMoviesPromises);
  
        detailedMovies.forEach((movie) => {
          const itemDiv = createMovieItem(movie);
          moviesContainer.appendChild(itemDiv);
        });

        createShowButton(section)

      } else {
        moviesContainer.innerHTML = "<p>Aucun film trouvé pour cette catégorie.</p>";
      }

    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
    }
}



// DISPLAY :


/**
 * Renders the “Best movie” block into the provided section using
 * the given movie data (image, title, summary, details button).
 *
 * @param {Object} bestMovieData - Movie object containing basic info and description.
 * @param {HTMLElement} section - Section element where the best movie must be displayed.
 * @returns {void}
 */
function displayBestMovie(bestMovieData, section) {

    const container = document.createElement('div');
    container.classList.add('container', 'item-grid');

    const bestMovieDiv = document.createElement('div');
    bestMovieDiv.classList.add('best-movie');

    bestMovieDiv.append(
        createMovieImage(bestMovieData.image_url),
        createMovieTitle(bestMovieData.title),
        createMovieSummary(bestMovieData.description),
        createMovieButton(bestMovieData)
    );

    // MODALE
    const bestImg = bestMovieDiv.querySelector('.best-movie-img img');
    if (bestImg) {
        bestImg.style.cursor = 'pointer';
        bestImg.addEventListener('click', () => {
            createMovieModal(bestMovieData);
        });
    }

    container.appendChild(bestMovieDiv);

    section.appendChild(container);
}


/**
 * Displays a list of movies in a section identified by the provided title.
 * Ensures the section and container exist, then appends a grid of movie cards.
 *
 * @param {Object[]} movies - Array of movie objects to display.
 * @param {string} sectionTitle - Human-readable title used to identify or create the section.
 * @param {HTMLElement|null} [container=null] - Optional existing container for the movies grid.
 * @returns {void}
 */
function displayMovies(movies, sectionTitle, container = null) {

    if (!movies || movies.length === 0) {
        console.warn(`Aucun film trouvé pour la section "${sectionTitle}".`);
        return;
    }

    let section = getOrCreateSection(sectionTitle);
    container = getOrCreateContainer(section, container);

    let borderWrapper = document.createElement("div");
    borderWrapper.classList.add("movies-border-wrapper");
    section.appendChild(borderWrapper);
    borderWrapper.appendChild(container);

    movies.forEach(movie => {
        const itemDiv = createMovieItem(movie);
        container.appendChild(itemDiv);
    });

    createShowButton(section);

    appendSectionToPage(section);
}


/**
 * Appends the given section element to the main container if it is not
 * already attached to the DOM.
 *
 * @param {HTMLElement} section - Section element to insert into the page.
 * @returns {void}
 */
function appendSectionToPage(section) {
    if (!section.parentElement) {
        document.querySelector('.main-container').appendChild(section);
    }
}



// CREATE :


/**
 * Creates and returns the page header element including the banner image.
 * The caller is responsible for appending it to the document.
 *
 * @returns {HTMLElement} The constructed <header> element.
 */
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


/**
 * Updates the banner image depending on the current viewport width.
 * Uses the logo on mobile and the full banner on tablet/desktop.
 *
 * @returns {void}
 */
function updateBannerImage() {
    const bannerImg = document.querySelector('header .banner img');
    if (window.matchMedia("(max-width: 767px)").matches) {
        bannerImg.src = 'style/logo.jpg';
    } else {
        bannerImg.src = 'style/banner.jpg';
    }
}


/**
 * Creates a new section element with the provided title and appends it
 * to the main container.
 *
 * @param {string} title - Text content of the section heading.
 * @returns {HTMLElement} The newly created section element.
 */
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


/**
 * Finds an existing section matching the given logical title (data-title)
 * or creates a new one if none exists.
 *
 * @param {string} sectionTitle - Logical title used in the data-title attribute.
 * @returns {HTMLElement} The existing or newly created section element.
 */
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


/**
 * Retrieves or creates the grid container element used to display movies
 * within a section.
 *
 * @param {HTMLElement} section - Section containing or receiving the container.
 * @param {HTMLElement|null} container - Optional existing container reference.
 * @returns {HTMLElement} The resolved container element for movie items.
 */
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


/**
 * Creates the “best movie” image container with a fallback image if
 * the provided URL is missing or fails to load.
 *
 * @param {string} imageUrl - URL of the movie poster image.
 * @returns {HTMLElement} A <div> element containing the <img>.
 */
function createMovieImage(imageUrl) {

    const movieImgDiv = document.createElement('div');
    movieImgDiv.classList.add('best-movie-img');

    const movieImg = document.createElement('img');

    const defaultImage = 'style/image-not-found.jpg';
  
    // Attribuer le src avec vérification de l'URL, sinon utiliser l'image par défaut :
    movieImg.src = (imageUrl && imageUrl.trim() !== '') ? imageUrl : defaultImage;

    // Attacher l'événement onerror à movieImg en cas d'erreur :
    movieImg.onerror = () => {
      movieImg.src = defaultImage;
    };
  
    movieImgDiv.appendChild(movieImg);
  
    return movieImgDiv;
}


/**
 * Creates the “best movie” title block wrapping the title in an <h2>.
 *
 * @param {string} title - Movie title to display.
 * @returns {HTMLElement} A <div> element containing the <h2> title.
 */
function createMovieTitle(title) {
    const movieTitleDiv = document.createElement('div');
    movieTitleDiv.classList.add('best-movie-title');
    
    const movieTitle = document.createElement('h2');
    movieTitle.textContent = title; // Titre dynamique
    
    movieTitleDiv.appendChild(movieTitle);
    return movieTitleDiv;
}


/**
 * Creates the “best movie” summary block with a paragraph that falls back
 * to a default text when no description is available.
 *
 * @param {string} description - Movie description or synopsis.
 * @returns {HTMLElement} A <div> element containing the summary paragraph.
 */
function createMovieSummary(description) {
    const movieSummaryDiv = document.createElement('div');
    movieSummaryDiv.classList.add('best-movie-summary');
    
    const movieSummary = document.createElement('p');
    movieSummary.textContent = description || "Résumé non disponible"; // Résumé dynamique
    
    movieSummaryDiv.appendChild(movieSummary);
    return movieSummaryDiv;   
}


/**
 * Creates a single movie card for use in a category grid, including
 * an image, title overlay, and a “Details” button that opens the modal.
 *
 * @param {Object} movie - Movie object containing at least title and image_url.
 * @returns {HTMLElement} A <div class="item"> representing the movie.
 */
function createMovieItem(movie) {

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const movieImg = document.createElement('img');
    movieImg.src = movie.image_url;
    movieImg.alt = movie.title;
    const defaultImage = 'style/image-not-found.jpg';
  
    movieImg.src = (movie.image_url && movie.image_url.trim() !== '') ? movie.image_url : defaultImage;
    movieImg.alt = movie.title;
  
    movieImg.onerror = () => {
        movieImg.src = defaultImage;
    };

    // Img = MODALE
    movieImg.addEventListener('click', () => {
    createMovieModal(movie);
    });

    const detailDiv = document.createElement('div');
    detailDiv.classList.add('detail');

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.title;

    const detailButton = document.createElement('button');
    detailButton.classList.add('btn');
    detailButton.textContent = "Détails";

    // MODALE
    detailButton.addEventListener('click', () => {
        createMovieModal(movie);
    });

    detailDiv.appendChild(movieTitle);
    detailDiv.appendChild(detailButton);

    itemDiv.appendChild(movieImg);

    itemDiv.appendChild(detailDiv);

    return itemDiv;
}


/**
 * Creates the “Details” button used in the best movie section and wires
 * it to open the modal for the provided movie data.
 *
 * @param {Object} movieData - Movie object used to populate the modal.
 * @returns {HTMLElement} A <div> containing the configured button element.
 */
function createMovieButton(movieData) {
    const movieButtonDiv = document.createElement('div');
    movieButtonDiv.classList.add('best-movie-button');
    
    const movieButton = document.createElement('button');
    movieButton.classList.add('best-movie-details-button');
    movieButton.textContent = 'Détails';
    
    movieButton.addEventListener('click', () => createMovieModal(movieData)); 
    
    movieButtonDiv.appendChild(movieButton);
    return movieButtonDiv;
}



// MODAL : 


/**
 * Builds and displays the movie details modal using the provided movie data.
 * Creates the layout, appends it to the document body, and locks the background scroll.
 *
 * @param {Object} movieData - Detailed movie object used to fill the modal content.
 * @returns {void}
 */
function createMovieModal(movieData) {

  const modal = createModalSection();
  const modalContent = createModalContent();

  const modalGrid = createModalGrid();
  modalGrid.appendChild(createModalCloseButton_X(modal)); // Icone X pour fermer le modal
  modalGrid.appendChild(createModalMainInfos(movieData)); // Informations principales du film
  modalGrid.appendChild(createModalMovieImage(movieData)); // Image du film
  modalGrid.appendChild(createModalMovieSummary(movieData)); // Résumé du film
  modalGrid.appendChild(createModalActorsSection(movieData)); // Acteurs du film

  modalContent.appendChild(modalGrid);

  modalContent.appendChild(createModalCloseButton(modal));

  modal.appendChild(modalContent);

  // --- Ajout de <section class="modal"> au body ---
  document.body.appendChild(modal);
  modal.style.display = "flex"; // force l'affichage du modal

  // Blocage du scroll du fond :

  // 1) Ajoute la classe de lock
  document.body.classList.add("modal-open");

  // 2) Enregistre la position de scroll actuelle
  const y = window.scrollY;
  document.body.dataset.scrollY = String(y);

  // 3) Fige le body pour éviter tout mouvement du fond
  document.body.style.position = "fixed";
  document.body.style.top = `-${y}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}


/**
 * Creates the root <section> element for the modal overlay.
 *
 * @returns {HTMLElement} The <section class="modal"> element.
 */
function createModalSection() {
    const modal = document.createElement("section");
    modal.className = "modal";
    return modal;
}


/**
 * Creates the main content container inside the modal which holds
 * the grid, text, image, and close button.
 *
 * @returns {HTMLElement} The <div class="modal-content"> element.
 */
function createModalContent() {
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    return modalContent;
}


/**
 * Creates the grid container that organizes all modal sub-sections
 * (header, info, image, summary, actors, close icon).
 *
 * @returns {HTMLElement} The <div class="modal-grid-container"> element.
 */
function createModalGrid() {
    const modalGrid = document.createElement("div");
    modalGrid.className = "modal-grid-container";
    return modalGrid;
}


/**
 * Builds the main information block of the modal, including title,
 * year, genres, rating, duration, country, IMDb score, box office,
 * and director.
 *
 * @param {Object} movieData - Movie object providing metadata fields.
 * @returns {HTMLElement} The <div class="modal-main-infos-movie"> element.
 */
function createModalMainInfos(movieData) {

    const mainInfos = document.createElement("div");
    mainInfos.className = "modal-main-infos-movie";

    // 1ère ligne : TITLE
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = movieData.title;
    mainInfos.appendChild(title);

    // 2) YEAR + CATEGORY
    const infoRow2 = document.createElement("div");
    infoRow2.className = "info-row";

    const year = document.createElement("div");
    year.className = "year";
    year.textContent = `${movieData?.year ?? "N/A"}  -`;
    infoRow2.appendChild(year);

    const category = document.createElement("div");
    category.className = "category";
    const genres = Array.isArray(movieData?.genres) ? movieData.genres.join(", ") : (movieData?.genres ?? "N/A");
    category.textContent = genres;
    infoRow2.appendChild(category);

    mainInfos.appendChild(infoRow2);

    // 3) AGE-PG + TIME + COUNTRY
    const infoRow3 = document.createElement("div");
    infoRow3.className = "info-row";

    const agePg = document.createElement("div");
    agePg.className = "age-pg";
    const rawRating = movieData?.rated;
    const rating = (rawRating === "Not rated or unkown rating" || rawRating === "Not rated or unknown rating" || !rawRating) ? "N/A" : rawRating;
    agePg.textContent = `PG: ${rating} -`;
    infoRow3.appendChild(agePg);

    const time = document.createElement("div");
    time.className = "time";
    const duration = Number(movieData?.duration);
    time.textContent = `Durée : ${Number.isFinite(duration) ? `${duration} minutes` : "N/A"} -`;
    infoRow3.appendChild(time);

    const country = document.createElement("div");
    country.className = "country";
    const countries = Array.isArray(movieData?.countries) ? movieData.countries.join(", ") : (movieData?.countries ?? "");
    country.textContent = countries || "N/A";
    infoRow3.appendChild(country);

    mainInfos.appendChild(infoRow3);

    // 4) IMDB-SCORE
    const imdbScore = document.createElement("div");
    imdbScore.className = "imdb-score";
    const imdbVal = (movieData?.imdb_score ?? null);
    imdbScore.textContent = `IMDb : ${imdbVal !== null && imdbVal !== undefined ? `${imdbVal} /10` : "N/A"}`;
    mainInfos.appendChild(imdbScore);

    // 5) BOX OFFICE (recettes mondiales)
    const boxOffice = document.createElement("div");
    boxOffice.className = "box-office";
    const gross = Number(movieData?.worldwide_gross_income);
    const boxText = Number.isFinite(gross)
        ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(gross)
        : "N/A";
    boxOffice.textContent = `Recettes : ${boxText}`;
    mainInfos.appendChild(boxOffice);

    // SPACE
    const space = document.createElement("div");
    space.className = "space";
    mainInfos.appendChild(space);

    // 6) LABEL
    const directorLabel = document.createElement("div");
    directorLabel.className = "label";
    directorLabel.textContent = "Réalisé par :";
    mainInfos.appendChild(directorLabel);

    // 7) DIRECTOR
    const director = document.createElement("div");
    director.className = "director";
    const directors = Array.isArray(movieData?.directors) ? movieData.directors.join(", ") : (movieData?.directors ?? "N/A");
    director.textContent = directors || "N/A";
    mainInfos.appendChild(director);

    return mainInfos;
    }


/**
 * Creates the block containing the movie poster image to be displayed
 * inside the modal.
 *
 * @param {Object} movieData - Movie object providing the image URL.
 * @returns {HTMLElement} The <div class="modal-image-movie"> element.
 */
function createModalMovieImage(movieData) {

    const modalImage = document.createElement("div");
    modalImage.className = "modal-image-movie";
  
    const img = document.createElement("img");
    const defaultImage = 'style/image-not-found-modal.jpg';
  
    img.src = movieData.image_url && movieData.image_url.trim() !== '' ? movieData.image_url : defaultImage;
    img.className = "modal-img";
  
    img.onerror = () => {
        img.src = defaultImage;
    };
  
    modalImage.appendChild(img);

    return modalImage;
}


/**
 * Creates the summary section of the modal containing the movie description.
 *
 * @param {Object} movieData - Movie object providing the long description.
 * @returns {HTMLElement} The <div class="modal-summary"> element.
 */
function createModalMovieSummary(movieData) {
  const modalSummary = document.createElement("span");
  modalSummary.className = "modal-summary";

  const rawText = movieData.long_description || movieData.description || "";

  // Fonction de validation : texte réellement informatif
  const isValidText = (s) => {
    if (typeof s !== "string") return false;
    const cleaned = s.trim();

    // Liste des textes à ignorer (placeholders de l'API)
    const invalidPlaceholders = [
      "add a plot >>",
      "add a plot",
      "no overview",
      "not available",
      "n/a",
      "|",
      "-",
      "—",
    ];

    return (
      cleaned.length > 0 &&
      !/^[\p{P}\p{S}\s]+$/u.test(cleaned) && // pas que ponctuation/espaces
      !invalidPlaceholders.includes(cleaned.toLowerCase())
    );
  };

  const summaryText = isValidText(rawText)
    ? rawText.trim()
    : "Résumé non disponible";

  modalSummary.textContent = summaryText;
  return modalSummary;
}


/**
 * Builds the actors section of the modal showing the label “With”
 * and the formatted list of actors.
 *
 * @param {Object} movieData - Movie object providing the actors list.
 * @returns {HTMLElement} The <div class="modal-with"> container with actors.
 */
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


/**
 * Creates the bottom “Close” button for the modal (desktop usage),
 * and wires it to fully close the modal and restore the scroll position.
 *
 * @param {HTMLElement} modal - Root modal element to be removed on close.
 * @returns {HTMLElement} The button container element added to the modal content.
 */
function createModalCloseButton(modal) {

    const btnContainer = document.createElement("div");
    btnContainer.className = "container container-flex";

    const btnClose = document.createElement("button");
    btnClose.className = "btn-close";
    btnClose.textContent = "Fermer";

    btnClose.addEventListener("click", () => {
        const savedY = parseInt(document.body.dataset.scrollY || "0", 10);

        document.body.classList.remove("modal-open");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        delete document.body.dataset.scrollY;

        window.scrollTo(0, savedY);

        modal.remove();
    });

    btnContainer.appendChild(btnClose);
    return btnContainer;
}


/**
 * Creates the top-right “X” icon used to close the modal on mobile/tablet,
 * including keyboard accessibility (Enter/Space/Escape).
 *
 * @param {HTMLElement} modal - Root modal element to be closed.
 * @returns {HTMLElement} The container wrapping the clickable close icon.
 */
function createModalCloseButton_X(modal) {

  const mobileContainer = document.createElement("div");
  mobileContainer.className = "container container-flex-MQ";

  // <span class="icon-close"> Icone X (CSS) </span> :
  const iconClose = document.createElement("span");
  iconClose.className = "icon-close";

  // Accessibilité et clavier
  iconClose.setAttribute("role", "button");
  iconClose.setAttribute("aria-label", "Fermer la modale");
  iconClose.setAttribute("tabindex", "0");

  // --- helper: fermeture + déblocage du fond ---
  const closeModal = () => {
    // retire la modale du DOM
    modal.remove();

    // 1) retire la classe de lock (overflow hidden + pointer-events)
    document.body.classList.remove("modal-open");

    // 2) si lock "parfait" via body fixed (optionnel)
    //    (à appliquer à l’ouverture : stocker scrollY dans data-scroll-y et fixer le body)
    const savedY = parseInt(document.body.dataset.scrollY || "0", 10);
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    delete document.body.dataset.scrollY;
    // restaure la position de scroll
    window.scrollTo(0, savedY);

    // 3) retire le listener clavier
    document.removeEventListener("keydown", onEsc);
  };

  // Fermeture via clavier (Escape)
  const onEsc = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    }
  };
  document.addEventListener("keydown", onEsc);

  // Fermeture via clic sur l'icône
  iconClose.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  // Fermeture via Enter / Space sur l'icône
  iconClose.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      closeModal();
    }
  });

  mobileContainer.appendChild(iconClose);
  return mobileContainer;
}



// MEDIA QUERIES - Tablet / Mobile


/**
 * Creates (or reuses) the responsive “Show more / Show less” button for a section.
 * Applies the 2/4/6 visibility rule depending on viewport and keeps the
 * initialization idempotent across re-renders.
 *
 * @param {HTMLElement} section - Section whose movie items should be toggled.
 * @returns {HTMLButtonElement} The toggle button element.
 */
function createShowButton(section) {
  // Anti-duplication: si déjà initialisé et le bouton existe, on rafraîchit et on sort
  const existingBtn = section.querySelector('.js-toggle-container .btn-show');
  if (section.__toggleInit === true && existingBtn) {
    // Réapplique l’état (par ex. après changement de catégorie)
    if (typeof section.__toggleApply === 'function') section.__toggleApply();
    return existingBtn;
  }
  // Cas où l’init flag est à true mais le bouton a été retiré du DOM (ex: innerHTML recréé)
  if (section.__toggleInit === true && !existingBtn) {
    section.__toggleInit = false; // on autorise une réinitialisation propre
  }

  // Récupérer toutes les cartes (sera réévalué dans applyState)
  let items = Array.from(section.querySelectorAll('.item'));

  // Conteneur + bouton (réutilise s'il existe déjà)
  let containerFlex = section.querySelector('.js-toggle-container');
  let button;

  if (containerFlex) {
    button = containerFlex.querySelector('.btn-show');
    if (!button) {
      button = document.createElement('button');
      button.classList.add('btn-show');
      button.textContent = 'Voir plus';
      containerFlex.appendChild(button);
    }
  } else {
    containerFlex = document.createElement('div');
    containerFlex.classList.add('container', 'container-flex', 'js-toggle-container');
    button = document.createElement('button');
    button.classList.add('btn-show');
    button.textContent = 'Voir plus';
    containerFlex.appendChild(button);
    section.appendChild(containerFlex);
  }

  // Breakpoints corrigés
  const mqMobile  = window.matchMedia('(max-width: 767px)');
  const mqTablet  = window.matchMedia('(min-width: 768px) and (max-width: 1280px)');
  const mqDesktop = window.matchMedia('(min-width: 1281px)');


  /**
   * Determines the current responsive mode (mobile, tablet, or desktop)
   * based on the configured media queries.
   *
   * @returns {('mobile'|'tablet'|'desktop')} The current display mode.
   */
  function mode() {
    if (mqMobile.matches) return 'mobile';
    if (mqTablet.matches) return 'tablet';
    return 'desktop'; // ≥1281
  }


  /**
   * Hides all movie cards starting from the given index by applying
   * the .is-hidden CSS class.
   *
   * @param {number} startIdx - Zero-based index from which items should be hidden.
   * @returns {void}
   */
  function hideFrom(startIdx) {
    items.forEach((el, i) => el.classList.toggle('is-hidden', i >= startIdx));
  }


  /**
   * Shows all movie cards by removing the .is-hidden CSS class.
   *
   * @returns {void}
   */
  function showAll() {
    items.forEach(el => el.classList.remove('is-hidden'));
  }

  let expanded = false;


  /**
   * Returns the maximum number of visible movie cards for the given
   * responsive mode, according to the 2/4/6 rule.
   *
   * @param {('mobile'|'tablet'|'desktop')} m - Current responsive mode.
   * @returns {number} The maximum number of visible items for this mode.
   */
  function quotaForMode(m) {
    if (m === 'mobile') return 2;
    if (m === 'tablet') return 4;
    return 6; // desktop
  }

  
  /**
   * Recomputes the items list, determines the current responsive mode,
   * and applies the correct visibility state and button label.
   * Also hides the button entirely on desktop.
   *
   * @returns {void}
   */
  function applyState() {
    // Resynchronise la liste si le DOM a été régénéré
    items = Array.from(section.querySelectorAll('.item'));

    const m = mode();
    const quota = quotaForMode(m);

    if (m === 'desktop') {
      // Desktop : tout afficher, bouton masqué (et déjà caché par le CSS desktop)
      showAll();
      button.classList.add('is-hidden');
      expanded = false;
      return;
    }

    // Mobile / Tablet
    if (items.length <= quota) {
      showAll();
      button.classList.add('is-hidden');
      expanded = false;
      return;
    }

    button.classList.remove('is-hidden');
    if (expanded) {
      showAll();
      button.textContent = 'Voir moins';
    } else {
      hideFrom(quota);
      button.textContent = 'Voir plus';
    }
  }

  // Écouteurs — ne les attache qu’une fois
  if (!button.dataset.bound) {
    button.addEventListener('click', () => {
      const m = mode();
      const quota = quotaForMode(m);

      if (!expanded) {
        showAll();
        button.textContent = 'Voir moins';
        expanded = true;
      } else {
        hideFrom(quota);
        button.textContent = 'Voir plus';
        expanded = false;
        section.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    });
    [mqMobile, mqTablet, mqDesktop].forEach(mq => {
      mq.addEventListener('change', () => {
        expanded = false; // retour au mode réduit au changement de tranche
        applyState();
      });
    });
    button.dataset.bound = '1';
  }

  // Marqueur d’initialisation + exposer un rafraîchissement
  section.__toggleInit = true;
  section.__toggleApply = applyState;

  // Initial
  applyState();

  return button;
}