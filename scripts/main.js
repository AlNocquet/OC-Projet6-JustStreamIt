/*********************************************************************************
 * 
 * Lancement du script 
 * 
 *********************************************************************************/


import { fetchAndSortMovies, getTop7Movies, getTop6MoviesByCategory } from './script.js'; // modules ES6
 

async function main() {
    try {
        const sortedMovies = await fetchAndSortMovies();
        const top7Movies = getTop7Movies(sortedMovies);
        console.log('Top 7 Movies:', top7Movies);
        const topMoviesByCategory = getTop6MoviesByCategory(sortedMovies);
        console.log('Top 6 Movies by Category:', topMoviesByCategory);
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
    }
}

main();
