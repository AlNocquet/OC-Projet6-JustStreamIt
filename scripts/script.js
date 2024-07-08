/*****************************************************************************************
 * 
 * scripts : scripts de requêtes et de création HTML dynamique du site web JustStreamIt
 * 
 ****************************************************************************************/

/// Gestion des erreurs
///  Consulter API code erreurs associés pour message



const categories = ["Films d'action", "Comédies", "Famille", "Films de fantasy", "Films d'horreur", "Science-fiction", "Westerns"];
//*** Liste dans config ?

const root = "http://localhost:8000/api/v1/"



/// FONCTION GET DATA (fetch)
///*** REQUETE API : Récupération des meilleurs films (sort_by=-imdb - ordre décroissant) depuis JSON 
///*** Toutes catégories confondues // Meilleur film : url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb"
///*** else : url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb" + category

function getDatas(category){

let url;
    if (category !== "Best_rating" && category !== "Best_movie") {
        url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=" + category
    }
    else {
        url = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score"
    }

}


// AFFICHAGE MEILLEUR FILM
//*** appel fonction function getDatas(category) ELSE
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



// AFFICHAGE CATEGORIE
/// *** appel fonction async function getDatas(category)

async function display(category) {

    // Créer l'élément <section>
    const sectionContainer = document.createElement('section');

    // Créer div "catégories"
    const categoriesDiv = document.createElement('div');
    categoriesDiv.className = 'categories';

    // Créer et ajouter "catégorie-items" x 6
    for (let i = 0; i < 6; i++) {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';

        const img = document.createElement('img');
        img.src = 'style/test.jpg';
        img.alt = 'Titre du film';

        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const p = document.createElement('p');
        p.textContent = 'Titre';

        const a = document.createElement('a');
        a.href = 'details.html';
        a.className = 'details-button';
        a.textContent = 'Détails';

        overlay.appendChild(p);
        overlay.appendChild(a);
        categoryItem.appendChild(img);
        categoryItem.appendChild(overlay);
        categoriesDiv.appendChild(categoryItem);
    }

    // Ajouter div 'categories' à <section>
    sectionContainer.appendChild(categoriesDiv);

    // Ajouter <section> au conteneur <div class="container"> existant dans le document HTML
    const container = document.getElementById('container');
    container.appendChild(section);

}


/// CREATION FORMULAIRE DROPDOWN

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
