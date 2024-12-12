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


// PSEUDO CODE - 12/12/2024

    // FETCH -------------------------------------------------------------------------------------------------------------------------

    async function getBestMovie() {

        // Fonction pour récupérer le Meilleur Film
                // Elle utilisera displayBestMovie() pour l’affichage. 
        

        // 1) Effectuer une requête à l'API : liste de films triés par leur score IMDb (décroissant) ;

        // 2) Vérifier la réponse : la réponse est correcte (code 2xx) ; Si la réponse HTTP n'est pas valide (code 4xx ou 5xx), une erreur est levée ; 

        // 3) Traiter les données : 
          // a) Si la réponse contient des films dans data.results ;
          // b) Elle récupère le premier (le mieux noté selon IMDb) ;
          // c) Elle l'affiche dans la console (ou envoyé à une fonction d'affichage dans l'interface utilisateur via appel de fonction displayBestMovie(bestMovie)) sinon un message d'erreur si aucun film n'est trouvé ;

        // 4) Si une erreur se produit (par exemple, réseau ou parsing), elle est capturée et affichée dans la console.

        }


    async function getTop6Movies() {

        // Fonction pour récupérer les 6 Meilleurs Films (exclusion du premier (result bestMovie)) 
                // Elle utilisera displayMovieList() pour l’affichage. 


        // 1) Effectuer une requête à l'API : récupérer une liste de films triés par leur score IMDb (décroissant) +
                // page_size=7 : L'API renverra 7 films dont meilleur film (le premier de la liste) ainsi que les 6 suivants.
                // start=0 : Récupération commence à partir du premier élément de la liste.

        // 2) Vérifier la réponse : la réponse est correcte (code 2xx) ; Si la réponse HTTP n'est pas valide (code 4xx ou 5xx), une erreur est levée ; 

        // 3) Traiter les données :
          // a) Si la réponse contient des films dans data.results ;
          // b) Elle extrait les 6 films suivants (excluant le premier film) : const topMovies = data.results.slice(1, 7)
          // c) Elle l'affiche dans la console (ou envoyé à une fonction d'affichage dans l'interface utilisateur via appel de fonction displayMovieList(topMovies)) sinon un message d'erreur si aucun film n'est trouvé ;

        // 4) En cas d'erreur (soit dans l'appel API, soit dans la gestion des données), elle affiche un message d'erreur dans la console.
        

        // OPTIMISATION 1) 3) 4) : renvoyer directement 6 films en passant page_size=6&start=1 pour éviter à l'API de gérer la pagination + slice côté client.
    
        }


    async function getTop6MoviesByCategory(category) {

        // Fonction pour Récupérer les 6 Meilleurs Films par Catégorie en passant le genre de film (fantasy, sci-fi)
                // Elle utilisera displayMovieList() pour l’affichage.
              
                
        // 1) Effectuer une requête à l'API : avec le paramètre genre égal à la catégorie donnée + triée par score IMDb +  limite la réponse à 6 films.
                // genre=${category} : Le paramètre genre est remplacé par la variable category passée à la fonction.
        
        // 2) Vérifier la réponse : la réponse est correcte (code 2xx) ; Si la réponse HTTP n'est pas valide (code 4xx ou 5xx), une erreur est levée.

        // 3) Traiter les données : Si la réponse contient des films dans data.results, ils sont affichés dans la console (et pourraient être envoyés à une fonction d'affichage dans l'interface utilisateur via appel de fonction displayMovieList(category)) sinon un message d'erreur si aucun film n'est trouvé ;
        
        // 4) Gestion des erreurs : Si la réponse est invalide ou si un problème survient lors du traitement des données, un message d'erreur est affiché dans la console.

        // AMELIORATION : Liste de catégories valides : vide ou undefined comme ?genre=&...// ?genre=undefined&... = Levée d'erreur sans explication + Appel API inutile

            // Bonne pratique :  utilisation encodeURIComponent encodeURIComponent, converti en une séquence sûre en remplaçant chaque caractère non sûr par son équivalent en pourcentage (%) suivi du code hexadécimal du caractère.
            
                // Caratères spéciaux comme &, ?, = qui ne font pas partis de la construction URL ;
                // Caractères non ASCII comme les accents (é, è, â) ;
                // Espaces utilisé par le client comme "Sci fi", bloquant sans encodage.

        }
    

    // OPTIMISATION DU CODE A VENIR: 
        // 1 ) Créer une fonction générique pour effectuer la requête API (fetchMovies).
        // 2 ) Fonctions spécifiques qui appellent cette fonction générique pour obtenir les films sous différentes conditions : meilleur film, top 6 films, films par catégorie.




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