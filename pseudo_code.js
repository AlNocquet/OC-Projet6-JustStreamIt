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

            // Afficher les informations du "meilleur film". EN COURS
            // Afficher les 6 meilleurs films dans chaque catégorie (général, fantasy, sci-fi).
            // Gérer la section choix "Dropdown"

            // Interactions et mises à jour dynamiques
            // Mettre en place des interactions (comme un clic pour afficher plus d'infos sur un film, plus de fims de la catégories).
            // S’assurer que le site fonctionne de manière réactive (même sur différents navigateurs).



// PSEUDO CODE - MAJ 31/12/2024 ; TRAVAIL EN COURS SECTION "MEILLEUR FILM"


// FETCH et GET -------------------------------------------------------------------------------------------------------------------------

 // RECUPERER RESUME VIA NODE.js ??
 // SECTION A CHOIX DIT "DROPDOWN" à coder


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

    
    
// DISPLAY ------------------------------------------------------------------------------------------------------------------------------


 // OPTIMISATION DU CODE : 
        // CENTRER EN CSS LE MAIN CONTENEUR
        // REVOIR CSS pour + clarté
        // Ajouter un événement `onclick` pour afficher plus d'infos sur le Meilleur film.


        function createMainContainer() {
        // Fonction Création conteneur : OK
            // Single Responsibility Principle, Conteneur indépendant de la génération des sections d'affichage.
            // Utilisation de main pour la sémantique, main sera le contenu principal de la page.
        }


            function createHeader() {
            // Fonction Création header : OK
                // A rattacher au conteneur.
            }

            function createSection() {
            // Fonction création section générique ( avec H1 dynamique) : OK
                // Single Responsibility Principle, Section d'affichage indépendante et réutilisable.
                // A rattacher au conteneur.
            }

            function displayBestMovie(bestMovie) {
            // Fonction Affichage Meilleur film : 
                // Créer génération HTML puis appel de cette fonction + function createSection() dans : async function getBestMovie()

                // ATTENTION : 
                    // Récupérer résumé et afficher correctement ;
                    // Revoir CSS en conséquence ;
                    // Ajouter un événement `onclick` pour afficher plus d'infos sur le film.
            }









// REFLEXIONS POUR PLUS TARD : 

    // DISPLAY MODALES -------------------------------------------------------------------------------------------------------------------

        // Fonction pour Afficher les Détails d’un Film : permet de récupérer des informations détaillées d'un film et de les afficher dans une modale. Le CSS gère les 3 responsive.

            function showMovieDetails(movieId) {
                // Faire une requête API pour récupérer les détails complets du film en utilisant son `movieId`
                // >> Extraire et afficher des informations supplémentaires (VOIR MAQUETTE)
                // Afficher ces informations dans une modale
            }


