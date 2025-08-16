document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsSection = document.getElementById('results');

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            alert('Please enter a song, artist, or album to search.');
            return;
        }

        resultsSection.innerHTML = '<h2>Loading...</h2>';

        try {
            // Deezer API endpoint for searching tracks
            const apiUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&output=jsonp`;
            
            // Deezer API requires JSONP for client-side requests due to CORS.
            // We'll use a simple JSONP handler.
            const jsonpCallback = 'jsonp_callback_' + Math.round(100000 * Math.random());
            window[jsonpCallback] = (data) => {
                displayResults(data.data);
                delete window[jsonpCallback]; // Clean up the callback function
            };

            const script = document.createElement('script');
            script.src = `${apiUrl}&callback=${jsonpCallback}`;
            script.onload = () => {
                document.body.removeChild(script); // Clean up the script tag after it's loaded and executed
            };
            document.body.appendChild(script);

        } catch (error) {
            console.error('Error fetching data from Deezer API:', error);
            resultsSection.innerHTML = '<p>Error loading results. Please try again later.</p>';
        }
    }

    function displayResults(tracks) {
        resultsSection.innerHTML = ''; // Clear previous results

        if (tracks.length === 0) {
            resultsSection.innerHTML = '<p>No results found.</p>';
            return;
        }

        tracks.forEach(track => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${track.album.cover_medium}" alt="${track.album.title}">
                <h3>${track.title}</h3>
                <p>${track.artist.name} - ${track.album.title}</p>
                <audio controls>
                    <source src="${track.preview}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            `;
            resultsSection.appendChild(card);
        });
    }
});
