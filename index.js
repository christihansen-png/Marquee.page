const searchForm = document.getElementById("search__form");

searchForm.addEventListener("submit", 
  async function (event) {
  event.preventDefault();
  const searchTerm = document.getElementById("search__input").value;
  const movieCards = document.getElementById("movie__cards");
  movieCards.innerHTML = `
  <li class="loader">
  <span class="loader__arrow">→</span>
  <span class="loader__target">📜</span>
  </li>
  `;
  const startTime = DateTransfer.now();
  console.log(searchTerm);

  const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=3448809e`);
  const data = await response.json();
  if (data.Response === "False") {
    movieCards.innerHTML = `<p class="no__results">No movies found. 😔 Please try another title! 🎞️ </p>`;
    return;
  }
  const detailedMovies = await Promise.all(
  data.Search.map(async function (movie) {
    const detailsResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=3448809e`);
    return await detailsResponse.json();  
    })
    const elapsed = Date.now() - startTime;

    if (elapsed < 1200) {
      await new Promise(resolve => setTimeout(resolve, 1200 - elapsed));
    }
);
  const cardsHTML = detailedMovies.map(function (movie) {
    return `
    <li class="movie__card">
    <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/no-poster.svg"}" onerror="this.onerror=null; this.src='assets/no-poster.svg';" alt="Poster for ${movie.Title}" class="card__poster">
    <h3 class="card__title">${movie.Title}</h3>
    <p class="card__year">${movie.Year}</p>
    <p class="card__genre">${movie.Genre !== "N/A" ? movie.Genre : '🧮 🤔'}</p>
    <p class="card__rating">⭐️ ${movie.imdbRating !== "N/A" ? movie.imdbRating : 'Not Rated'}</p>
    <p class="card__time">${movie.Runtime !== "N/A" ? movie.Runtime : '⏳ 🤔'}</p>
    <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="card__link">View on IMDb</a>
    </li>`;
    })
  movieCards.innerHTML = cardsHTML.join("");
})