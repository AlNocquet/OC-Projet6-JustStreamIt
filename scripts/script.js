/*****************************************************************************************
 * 
 * scripts : scripts de requêtes et de création HTML dynamique du site web JustStreamIt
 * 
 ****************************************************************************************/


// Déclare une constante movie qui est un tableau contenant un objet avec des informations de base sur un film. Cet objet a trois propriétés.
const movie = [
    { titre: "Film", imageUrl: "style/test.jpg", detailsUrl: "details.html"}]

// Déclare une constante root qui contient l'URL de base de l'API. 
// Cette URL sera utilisée pour construire les URLs complètes des requêtes API et des ressources associées (comme les images et les détails).
const root = "http://localhost:8000/api/v1/"


// Fonction asynchrone pour récupérer les films depuis l'API et les trier.
export async function fetchAndSortMovies() {
    // Le code dans le bloc try est exécuté. Si erreur, le bloc catch la capture et la gère.
    try {
        const response = await fetch(`${root}movies`); // Utilise l'API Fetch pour envoyer requête GET à l'URL ; attend la réponse avant instruction suivante ;
        const movies = await response.json(); // Extrait données de la réponse de l'API sous forme JSON ;

        // Ajout des URLs complètes pour chaque film
            // Méthode .map() pour créer un nouveau tableau moviesWithUrls à partir du tableau movies généré.
            // Pour chaque film dans movies, un nouvel objet est créé, en ajoutant des URLs complètes pour imageUrl et detailsUrl.
        const moviesWithUrls = movies.map(movie => {
            return {
                ...movie, // Opérateur de décomposition pour copier toutes les propriétés du film actuel dans le nouvel objet.
                imageUrl: `${root}${movie.imageUrl}`, // Concaténation pour URL complète pour l'image
                detailsUrl: `${root}${movie.detailsUrl}` // Concaténation pour URL complète pour les détails
            };
        });

        // Tri des films par score décroissant
        // Fonction de comparaison (a, b) => b.score - a.score compare les scores de deux films, a et b, ainsi de suite.
        const sortedMovies = moviesWithUrls.sort((a, b) => b.score - a.score);
        return sortedMovies;

    } catch (error) {
        console.error('Erreur lors de la récupération et du tri des films:', error);
        throw error; // Relancer l'erreur pour que la fonction appelante puisse également la gérer
    }
}


export function getTop7Movies(movies) {
    // Méthode slice pour créer et retourner un nouveau tableau contenant les 7 premiers films du tableau d'origine.
    return movies.slice(0, 7);  
}


export function getTop6MoviesByCategory(movies) {
    
    const categories = [
        "Films d'action",
        "Comédies",
        "Famille",
        "Films de fantasy",
        "Films d'horreur",
        "Science-fiction",
        "Westerns"
    ];


    const moviesByCategory = {};

    // Initialiser les catégories dans l'objet moviesByCategory
    categories.forEach(category => {
        moviesByCategory[category] = [];
    });

    // Parcourir chaque film pour l'ajouter à la catégorie correspondante
    movies.forEach(movie => {
        if (categories.includes(movie.category)) { // Vérifie si la catégorie du film est dans la liste des catégories prédéfinies.
            moviesByCategory[movie.category].push(movie); // Si oui, ajoute le film actuel dans le tableau de sa catégorie.
        }
    });

    // Trier les films dans chaque catégorie et sélectionner les 6 meilleurs
    for (let category of categories) {
        moviesByCategory[category] = moviesByCategory[category]
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);
    }

    return moviesByCategory; 
    // Le résultat final est un objet où chaque clé est une catégorie et chaque valeur est un tableau des 6 meilleurs films pour cette catégorie.
}













// Fonction générer Catégorie Meilleur Film:
function createBestMovieSection() {

    // Créer l'élément <section>
    const section = document.createElement('section');

    // Créer le titre h1 de la section
    const h1 = document.createElement('h1');
    h1.textContent = 'Meilleur film';
    section.appendChild(h1);

    // Créer la div "category-best-movie"
    const categoryBestMovieDiv = document.createElement('div');
    categoryBestMovieDiv.className = 'category-best-movie';

    // Créer l'élément-1 avec l'image
    const element1 = document.createElement('div');
    element1.className = 'element-1';
    const img = document.createElement('img');
    img.src = 'style/test-meilleur-film.jpg';
    img.alt = 'Titre du meilleur film';
    element1.appendChild(img);

    // Créer l'élément-2 avec le titre du film
    const element2 = document.createElement('div');
    element2.className = 'element-2';
    const movieTitle = document.createElement('h1');
    movieTitle.textContent = 'Titre du meilleur film';
    element2.appendChild(movieTitle);

    // Créer l'élément-3 avec le résumé  ==> Voir API requête
    const element3 = document.createElement('div');
    element3.className = 'element-3';
    // const movieSummary = 
    element3.appendChild(movieSummary);

    // Créer l'élément-4 avec le bouton détails
    const element4 = document.createElement('div');
    element4.className = 'element-4';
    const detailsButton = document.createElement('button');
    detailsButton.className = 'best-movie-details-button';
    const detailsLink = document.createElement('a');
    detailsLink.href = 'details.html';
    detailsLink.textContent = 'Détails';
    detailsButton.appendChild(detailsLink);
    element4.appendChild(detailsButton);

    // Ajouter les éléments 1/2/3/4 à div "category-best-movie"
    categoryBestMovieDiv.appendChild(element1);
    categoryBestMovieDiv.appendChild(element2);
    categoryBestMovieDiv.appendChild(element3);
    categoryBestMovieDiv.appendChild(element4);

    // Ajouter div 'category-best-movie' à <section>
    section.appendChild(categoryBestMovieDiv);

    // Ajouter <section> au conteneur <div class="container"> existant dans le document HTML
    const container = document.getElementById('container');
    container.appendChild(section);
}


// Fonction générer Catégorie de film :
function generateFilmSection() {

    // Créer l'élément <section>
    const section = document.createElement('section');
    // Créer l'élément <h1>
    const title = document.createElement('h1');
    // Gérer DYNAMIQUEMENT l'élément <h1>
    title.textContent = "";
    section.appendChild(title);

    // Créer div "category"
    const categoriesDiv = document.createElement('div');
    categoriesDiv.className = 'category';


    // Créer et ajouter "category-item" x 6 avec const Film
    for (let i = 0; i < 6; i++) {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';

        categoryItem.innerHTML = `
            <img src="${film.imageUrl}" alt="${film.titre}">
            <div class="overlay">
                <h3>${film.titre}</h3>
                <a href="${film.detailsUrl}" class="details-button">Détails</a>
            </div>
        `;

        categoriesDiv.appendChild(categoryItem);
    };

    // Ajouter div 'categories' à <section>
    section.appendChild(categoriesDiv);
    // Ajouter <section> au conteneur <div class="container">
    const container = document.getElementById('container');
    container.appendChild(section);
}


// Fonction générer Catégorie Dropdown :
function createCategoryDropdown() {

    // Créer div 'category-dropdown'
    const categoryDropdownDiv = document.createElement('div');
    categoryDropdownDiv.className = 'category-dropdown';

    // Créer titre
    const h1 = document.createElement('h1');
    h1.textContent = 'Autres :';

    // Créer <select> avec options
    const select = document.createElement('select');

    categories.forEach(category => {
        const option = document.createElement('option');
        option.textContent = category;
        select.appendChild(option);
    });

    // Ajouter titre et dropdown à la div 'category-dropdown'
    categoryDropdownDiv.appendChild(h1);
    categoryDropdownDiv.appendChild(select);

    // Ajouter la div 'category-dropdown' au container "section"
    sectionContainer.appendChild(categoryDropdownDiv);
}


// RETOURNER VALEUR DROPDOWN
function getSelectedCategory() {
    }

    ///***Affichage de la catégorie choisie : Appel fonction async function display(movies)
