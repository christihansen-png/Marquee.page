

async function movieLinks(){
  const movie = await fetch (`http://www.omdbapi.com/?i=tt3896198&apikey=3448809e`)
  const movieData = await movie.json();
  console.log(movieData)
}

movieLinks();
// const API_KEY = "3448809e"; 