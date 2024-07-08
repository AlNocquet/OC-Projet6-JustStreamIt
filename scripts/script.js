/*****************************************************************************************
 * 
 * scripts : scripts de requêtes et de création HTML dynamique du site web JustStreamIt
 * 
 ****************************************************************************************/

/// fetch


/// async function getDatas(category)
///*** REQUETE API : Récupération des meilleurs films (sort_by=-imdb - ordre décroissant) depuis JSON 
///*** Toutes catégories confondues // Meilleur film : url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb"
///*** else : url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb" + category


let url;
    if (category !== "Best_rating" && category !== "Best_movie") {
        url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=" + category
    }
    else {
        url = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score"
    }


/// async function display(bestmovie)
/// *** appel fonction async function getDatas(category)
/// *** création HTML inner - voir version static HTML


/// async function display(movies) 
/// *** appel fonction async function getDatas(category)
/// *** boucle for 6 films
/// *** création HTML - voir version static HTML


/// Formulaire section dropdown
/// *** appel fonction async function display(movies)
/// *** création HTML - voir version static HTML


///Gestion des erreurs
/// *** console.log()
/// *** Consulter API code erreurs associés pour message
