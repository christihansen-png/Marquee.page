let currentMovies = [];
const searchForm = document.getElementById("search__form");

async function searchMovies(searchTerm, familyOnly = false, genre = "") {
  const movieCards = document.getElementById("movie__cards");
  movieCards.innerHTML = `
  <li class="loader">
  <span class="loader__arrow">→</span>
  <span class="loader__target">📜</span>
  </li>
  `;
  const startTime = Date.now();

  const response = await fetch(
    `https://www.omdbapi.com/?s=${searchTerm}&apikey=3448809e`,
  );
  const data = await response.json();
  const response2 = await fetch(
    `https://www.omdbapi.com/?s=${searchTerm}&page=2&apikey=3448809e`,
  );
  const data2 = await response2.json();
  if (data.Response === "False") {
    movieCards.innerHTML = `<p class="no__results">No movies found. 😔 Please try another title! 🎞️ </p>`;
    return;
  }
  const allResults = data.Search.concat(data2.Search || []);
  const detailedMovies = await Promise.all(
    allResults.map(async function (movie) {
      const detailsResponse = await fetch(
        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=3448809e`,
      );
      return await detailsResponse.json();
    }),
  );
  const elapsed = Date.now() - startTime;

  if (elapsed < 1200) {
    await new Promise((resolve) => setTimeout(resolve, 1200 - elapsed));
  }

  let moviesToShow = detailedMovies;

  if (familyOnly) {
    moviesToShow = detailedMovies.filter(function (movie) {
      return movie.Rated === "G" || movie.Rated === "PG";
    });
  }

  if (genre) {
    moviesToShow = moviesToShow.filter(function (movie) {
      return movie.Genre.includes(genre);
    });
  }

  if (moviesToShow.length === 0) {
    movieCards.innerHTML = `<p class="no__results">No movies found. Please Try another genre! 🍿 🎥</p>`;
    return;
  }

  currentMovies = moviesToShow;
  sortAndRender();
}

function renderMovies(movies) {
  const movieCards = document.getElementById("movie__cards");
  const cardsHTML = movies.map(function (movie) {
    return `
    <li class="movie__card">
    <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/no-poster.svg"}" onerror="this.onerror=null; this.src='assets/no-poster.svg';" alt="Poster for ${movie.Title}" class="card__poster">
    <h3 class="card__title">${movie.Title}</h3>
    <p class="card__year">${movie.Year}</p>
    <p class="card__genre">${movie.Genre !== "N/A" ? movie.Genre : "🧮 🤔"}</p>
    <p class="card__rating">⭐️ ${movie.imdbRating !== "N/A" ? movie.imdbRating : "Not Rated"}</p>
    <p class="card__time">${movie.Runtime !== "N/A" ? movie.Runtime : "⏳ 🤔"}</p>
    <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="card__link">View on IMDb</a>
    </li>`;
  });
  movieCards.innerHTML = cardsHTML.join("");
}

function sortAndRender() {
  const sortBy = document.getElementById("sort__select").value;
  const sorted = currentMovies.slice();

  if (sortBy === "az") {
    sorted.sort(function (a, b) {
      return a.Title.localeCompare(b.Title);
    });
  } else if (sortBy === "za") {
    sorted.sort(function (a, b) {
      return b.Title.localeCompare(a.Title);
    });
  } else if (sortBy === "newest") {
    sorted.sort(function (a, b) {
      return parseInt(b.Year) - parseInt(a.Year);
    });
  } else if (sortBy === "oldest") {
    sorted.sort(function (a, b) {
      return parseInt(a.Year) - parseInt(b.Year);
    });
  }

  renderMovies(sorted);
}

document
  .getElementById("sort__select")
  .addEventListener("change", sortAndRender);
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTerm = document.getElementById("search__input").value;
  searchMovies(searchTerm);
});

const navTools = document.querySelectorAll(".nav__tool");

navTools.forEach(function (link) {
  link.addEventListener("click", function () {
    searchMovies(
      link.dataset.search,
      link.dataset.family === "true",
      link.dataset.genre,
    );
  });
});
