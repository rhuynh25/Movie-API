const form = document.getElementById('movieSearchForm');
const movieSearchInput = document.getElementById('movieSearchInput');
const movieSearchResults = document.getElementById('movieSearchResults');
const otherSimilarMovies = document.getElementById('otherSimilarMovies');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Clear previous search results
    movieSearchResults.innerHTML = '';
    otherSimilarMovies.innerHTML = '';

    // Get the value from the input
    const searchTerm = movieSearchInput.value.trim();

    if (searchTerm === '') {
        alert('Please enter a movie title');
        return;
    } try {
        // Fetch movie data from the server
        const response = await fetch(`/search?title=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        // Display search results
        if (data.length > 0) {
            data.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie');
                movieElement.textContent = `${movie.title} (${movie.release_date.split('-')[0]})`;
                movieElement.addEventListener('click', async () => {
                    const similarResponse = await fetch(`/similar?id=${movie.id}`);
                    const similarData = await similarResponse.json();
                    displaySimilarMovies(similarData, movie.title);
                });
                movieSearchResults.appendChild(movieElement);
            });
        } else {
            movieSearchResults.textContent = 'No movies found';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        movieSearchResults.textContent = 'Failed to fetch movies. Please try again.';
    }
});

async function displaySimilarMovies(similarMovies, selectedMovieTitle) {
    otherSimilarMovies.innerHTML = '';
    const header = document.createElement('h3');
    header.textContent = `Similar Movies for "${selectedMovieTitle}"`;
    otherSimilarMovies.appendChild(header);

    if (similarMovies.length > 0) {
        similarMovies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.textContent = `${movie.title} (${movie.release_date.split('-')[0]})`;
            otherSimilarMovies.appendChild(movieElement);
        });
    } else {
        const noSimilarMovies = document.createElement('div');
        noSimilarMovies.textContent = 'No similar movies found';
        otherSimilarMovies.appendChild(noSimilarMovies);
    }
}