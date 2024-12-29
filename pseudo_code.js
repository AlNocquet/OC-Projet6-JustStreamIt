// PROJET 6 : JUST STREAM IT

    // Objectif principal : Afficher un classement de films en temps réel en se basant sur les données de l'API OCMovies.

    // Étapes principales du projet :

        // Initialisation du Projet
        
            // Configurer l'API locale (étape 1 à 7 install, puis 4 à 7 utilisation).
                // Charger les dépendances nécessaires pour lancer l'API (se référer au README du projet). OK
            // Préparer les éléments de l'interface utilisateur.
                // Initialiser le site avec une structure HTML de base (header, sections pour chaque catégorie de films). OK

            // Récupération des données de l'API
            // Faire une requête vers l’API pour obtenir les films. OK
                // Assurer que l'API est en marche pour tester les appels et les réponses. OK

            // Organiser et filtrer les films en catégories (meilleur film, top 6, fantasy, sci-fi). OK

            // Affichage des films
            // Afficher les informations du "meilleur film".
            // Afficher les 6 meilleurs films dans chaque catégorie (général, fantasy, sci-fi).
            // Gérer la section choix "Dropdown"

            // Interactions et mises à jour dynamiques
            // Mettre en place des interactions (comme un clic pour afficher plus d'infos sur un film, plus de fims de la catégories).
            // S’assurer que le site fonctionne de manière réactive (même sur différents navigateurs).


// PSEUDO CODE - 29/12/2024

 // OPTIMISATION DU CODE : 

        // Centralisation / Réduction redondance du code / Robustesse :
            // Créer une fonction générique pour effectuer la requête API (fetchMovies(apiUrl)).
            // Fonctions spécifiques qui appellent cette fonction générique pour obtenir les films sous différentes conditions : meilleur film, top 6 films, films par catégorie. OK
            // Gestion des erreurs et propagation. OK

        // async function getTop6Movies() : renvoyer directement 6 films avec page_size=6&start=1 pour éviter à l'API de gérer pagination + slice côté client. OK

        // async function getTop6MoviesByCategory(category) : Extract dynamique liste catégories de l'API + gestion dynamique de la pagination. OK

 // A TRAVAILLER : Optimisation requête API dans async function getTop6MoviesByCategory(category) : créer fonction qui récupère une fois tous les genres, puis    réutiliser ces données dans les appels suivants.


    // FETCH et GET -------------------------------------------------------------------------------------------------------------------------

        async function fetchMovies(apiUrl) {
        // Fonction async pour fetch :
        
            // 1) Effectuer une requête à l'API : paramètre apiUrl

            // 2) Vérifier la réponse : la réponse est correcte (code 2xx) ; Si la réponse HTTP n'est pas valide (code 4xx ou 5xx), une erreur est levée ; 

            // 3) Conversion en JSON : Conversion en objet JavaScript expoitable ; Lève exception si le format de la réponse n'est pas du JSON valide ;

            // 4) Si ok, Retourne ;

            // 5) Propagation des erreurs (Erreur réseau, réponse non valide, problème de conversion JSON) : catch et trow, relance l'erreur vers fonction appelante (getBestMovie, etc.) // chaque fonction appelée gère ses erreurs avec message approprié ou essai autre Url.

            }


        async function getBestMovie() {
        // Fonction async pour récupérer le Meilleur Film via fetchMovies(apiUrl) et l'afficher :
                // A venir : Elle utilisera displayBestMovie() pour l’affichage. 
            
            // 1) Définir CONST apiUrl : liste de films triés par leur score IMDb (décroissant);

            // 2) Appeler la fonction fetchMovies avec paramètre apiUrl ; 

            // 3) Traiter les données : 
                // a) Si la réponse contient des films dans data.results ;
                // b) Elle l'affiche dans la console SINON "Aucun film trouvé"

            // 4) Gestion des erreurs : Si échec appel à fetchMovies (problème réseau ou API indisponible, ...), elle est interceptée dans le bloc catch, message d'erreur.

            }


        async function getTop6Movies() {
        // Fonction async pour récupérer les 6 Meilleurs Films via fetchMovies(apiUrl) et l'afficher :
                // A venir : Elle utilisera displayMovieList() pour l’affichage. 

            // 1) Définir CONST apiUrl : liste de films triés par leur score IMDb (décroissant) +
                    // page_size=6 : L'API renverra 6 films de la liste + 
                    // start=1 : Récupération commence à partir du 2ième élément de la liste.

            // 2) Appeler la fonction fetchMoviesavec paramètre apiUrl ; 

            // 3) Traiter les données : 
                // a) Si la réponse contient des films dans data.results ;
                // b) Elle l'affiche dans la console SINON "Aucun film trouvé".

            // 4) Gestion des erreurs : Si échec appel à fetchMovies (problème réseau ou API indisponible, ...), elle est interceptée dans le bloc catch, message d'erreur.
            
            }


        async function getTop6MoviesByCategory(category) {
        // Fonction async pour récupérer les 6 Meilleurs Films par Catégorie, puis l'afficher :
                // A venir : Elle utilisera displayMovieList() pour l’affichage. 

            // 1) Récupérer tous les genres via la fonction fetchAllGenres ;

            // 2) Vérifier si la catégorie est valide en appelant isValidCategory ;
                // Arrêter la fonction si la catégorie n'est pas valide.

            // 3) Si la catégorie est valide, elle effectue une requête pour récupérer les films correspondants en appelant fetchMoviesByCategory ;
                // La promesse sera stocké dans data.

            // 4) Traiter les données : 
                    // a) Extraire les résultats de la réponse API ou un tableau vide par défaut ;
                        // Si data est défini et contient la clé results, alors la valeur de results sera assignée à la variable results.
                        // Si data ou data.results est undefined (par exemple, en cas d'erreur ou de réponse vide), alors results sera un tableau vide ([]).
                    // b) Si la réponse contient des films dans data.results ;
                    // c) Elle l'affiche dans la console SINON "Aucun film trouvé pour la catégorie '' ".

            // 5) Gestion des erreurs : 
                // Toute erreur qui pourrait survenir dans le bloc try, capturée et message d'erreur.

            }

        
        async function fetchAllGenres() {
        // Fonction async pour récupérer dynamiquement les genres depuis l'API ("http://localhost:8000/api/v1/genres/") + Gestion pagination :

            // 1) Définir tableau vide allGenres pour stocker tous les genres récupérés à partir de l'API ;

            // 2) Initialiser nextPageUrl à l'URL de la première page des genres : "http://localhost:8000/api/v1/genres/";

            // 3) Boucle pour récupérer toutes les pages de genres :
                // Vérifier la réponse de l'API : si  OK (status 2xx) SINON une erreur est levée (message console : "Erreur lors de la récupération des genres");
                // Parser en Json + Ajouter au tableau les genres de la page courante;
                // Vérifier s'il y a une page suivante;

            // 4) Retourner
   
        }
        
        function isValidCategory(category, allGenres) {
        // Fonction pour vérifier si une catégorie donnée existe dans la liste des genres disponibles récupérés depuis l'API :

            // 1) Vérifier la validité de la catégorie avec +sieurs conditions :
                    // a) typeof category !== "string" : Si la catégorie n'est pas une chaîne de caractères.
                    // b) category.trim() === "" : Si la catégorie est une chaîne vide (après avoir enlevé les espaces inutiles).

            // 2) Création d'un tableau 'validCategories' (.map) contenant les noms des genres en minuscules ;
                // Extrait chaque genre (genre.name) et le transforme en minuscules pour la rendre insensible à la casse.

            // 3) Vérification si la catégorie donnée existe dans le tableau 'validCategories'.
                // Retourne true or false

        }

        async function fetchMoviesByCategory(category) {
        // Fonction async pour récupérer les films par catégorie :

            // 1) Construire dynamiquement l'URL de l'API pour récupérer les films par catégorie spécifiée : 
                // Définir CONST apiUrl avec encodeURIComponent + paramètre category : liste de films triés par leur score IMDb (décroissant) + page_size=6

                    // Bonne pratique gestion utilisateur : utilisation encodeURIComponent, converti en une séquence sûre en remplaçant chaque caractère non sûr par son équivalent en pourcentage (%) suivi du code hexadécimal du caractère.
                        
                        // Caratères spéciaux comme &, ?, = qui ne font pas partis de la construction URL ;
                        // Caractères non ASCII comme les accents (é, è, â) ;
                        // Espaces utilisé par le client comme "Sci fi", bloquant sans encodage.

             // 2) Retourner avec Appel async fetchMovies avec l'URL générée (apiUrl).

        }

//-----------------------------------------------------------------------------------------------------------------------------------------



// REFLEXIONS POUR PLUS TARD : 

    // SECTION A CHOIX DIT "DROPDOWN" à coder
    
    
    // DISPLAY -------------------------------------------------------------------------------------------------------------------------


        // Fonction pour Afficher le Meilleur Film dans le DOM (Affichage "type A") : reçoit les données du meilleur film et les injecte dans la section dédiée de l’HTML.

            function displayBestMovie(movieData) {
            // Sélectionner la section HTML pour le "Meilleur Film"
            // Injecter le titre, l'image, la description du film à partir des données `movieData` - dico JSON
            // Ajouter un événement `onclick` pour afficher plus d'infos sur le film
            }


        // Fonction pour Afficher une Liste de Films (Affichage "type B") : gère l’affichage d’une liste de films pour une catégorie donnée. Elle boucle sur movieList et affiche chaque film dans la section associée.

            function displayMovieList(movieList, category) {
                // Sélectionner la section HTML correspondant à la catégorie (Top 6, Fantasy, Sci-Fi)
                // Boucler sur `movieList` pour afficher chaque film avec son titre, image, et description - dico JSON
                // Ajouter un événement `onclick` pour afficher plus d'infos sur chaque film
                // Ajouter un événement `onclick` pour afficher plus de films
            }


    // DISPLAY MODALES -------------------------------------------------------------------------------------------------------------------

        // Fonction pour Afficher les Détails d’un Film : permet de récupérer des informations détaillées d'un film et de les afficher dans une modale. Le CSS gère les 3 responsive.

            function showMovieDetails(movieId) {
                // Faire une requête API pour récupérer les détails complets du film en utilisant son `movieId`
                // >> Extraire et afficher des informations supplémentaires (VOIR MAQUETTE)
                // Afficher ces informations dans une modale
            }

    
    // INIT -------------------------------------------------------------------------------------------------------------------------------

        // Fonction d'Initialisation pour Charger les Données lors du Chargement de la Page : lors du chargement de la page, appelle toutes les fonctions nécessaires pour récupérer et afficher les différentes catégories de films.

            async function init() {
                // Appeler `getBestMovie()` pour récupérer et afficher le meilleur film
                // Appeler `getTop6Movies()` pour récupérer et afficher les 6 meilleurs films suivants
                // Appeler `getTopMoviesByCategory('fantasy')` pour les films de catégorie Fantasy
                // Appeler `getTopMoviesByCategory('sci-fi')` pour les films de catégorie Sci-Fi
                // Assurer que chaque appel de fonction affiche les films correspondants dans le DOM (catch error)
            }

    
    // Appeler la fonction d'initialisation sans attendre chargement de tous les éléments :
    document.addEventListener("DOMContentLoaded", init); 