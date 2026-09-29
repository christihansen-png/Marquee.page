const searchForm = document.getElementById("search__form");

searchForm.addEventListener("submit", 
  async function (event) {
  event.preventDefault();
  const searchTerm = document.getElementById("search__input").value;
  console.log(searchTerm);

  const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=3448809e`);
  const data = await response.json();
  console.log(data);
})