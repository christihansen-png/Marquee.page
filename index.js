const searchForm = document.getElementById("search__form");

searchForm.addEventListener("submit", 
  async function (event) {
  event.preventDefault();
  const searchTerm = document.getElementById("search__input").value;
  console.log(searchTerm);

  const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=3448809e`);
  const data = await response.json();
  const detailedMovies = await Promise.all(
  data.Search.map(async function (movie) {
    const detailsResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=3448809e`);
    return await detailsResponse.json();  
    })
);

  const movieCards = document.getElementById("movie__cards");

  const cardsHTML = detailedMovies.map(function (movie) {
    return `
    <li class="movie__card">
    <img src="${movie.Poster}" alt="Poster for ${movie.Title}" class="card__poster">
    <h3 class="card__title">${movie.Title}</h3>
    <p class="card__year">${movie.Year}</p>
    <p class="card__genre">${movie.Genre}</p>
    <p class="card__rating">${movie.imdbRating}/10</p>
    <p class="card__time">${movie.Runtime}</p>
    <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="card__link">View on IMDb</a>
    </li>`;
    })
  movieCards.innerHTML = cardsHTML.join("");
})