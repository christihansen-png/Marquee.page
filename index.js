const searchForm = document.getElementById("search__form");

searchForm.addEventListener("submit", 
  async function (event) {
  event.preventDefault();
  const searchTerm = document.getElementById("search__input").value;
  console.log(searchTerm);

  const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=3448809e`);
  const data = await response.json();
  const movieCards = document.getElementById("movie__cards");

  const cardsHTML = data.Search.map(function (movie) {
    return `
    <li class="movie__card">
    <img src="${movie.Poster}" alt="Poster for ${movie.Title}" class="card__poster">
    <h3 class="card__title">${movie.Title}</h3>
    <p class="card__year">${movie.Year}</p>
    <p class="card__type">${movie.Type}</p>
    <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="card__link">View on IMDb</a>
    </li>
    `;
    })
  movieCards.innerHTML = cardsHTML.join("");
})