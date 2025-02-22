const srchBtn = document.querySelector('.btnSearch');
srchBtn.addEventListener('click', async function() {
  const inp = document.querySelector('.inp');
  
  const movies = await getMovies(inp.value);
  resultUI(movies);

});

document.addEventListener('click', async function(e) {
  if(e.target.classList.contains('btnDtl')) {
    const imdbid = e.target.dataset.imdbid;
    const detail = await getMoviesDetail(imdbid);
    resultDtl(detail);
  }
});

const getMoviesDetail = imdbid => {
  return fetch('http://www.omdbapi.com/?apikey=11820e80&i=' + imdbid)
    .finally(() => {
      document.querySelector('.mdlDtl').innerHTML = loading();
    })
    .then(response => response.json())
    .then(m => document.querySelector('.mdlDtl').innerHTML = showModal(m));
}

const getMovies = key => {
  return fetch('http://www.omdbapi.com/?apikey=11820e80&s=' + key)
    .finally(() => {
      document.querySelector('.movieCards').innerHTML = loading();
    })
    .then(response => response.json())
    .then(response => {
      if(response.Response === "True") {
        return response.Search;
      } else {
        return response.Response;
      }
    });
}

const resultUI = movies => {
  if(movies === "False") {
    document.querySelector('.movieCards').innerHTML = `<div class="alert alert-danger" role="alert">
                                Movie not found!
                              </div>`;
  } else {
    let cards = '';
  movies.forEach(m => {
    cards += showCards(m);
  });

  document.querySelector('.movieCards').innerHTML = cards;
  }
}



const loading = () => {
  return`<div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
         </div>`;
}

const showCards = m => { 
  return `<div class="col-md-3 my-2">
            <div class="card mb-4">
              <img src="${m.Poster}" class="card-img-top" alt="Movie Poster">
              <div class="card-body">
                <h5 class="card-title">${m.Title}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${m.Year}</h6>
                <button class="btn btn-primary btnDtl" data-bs-toggle="modal" data-imdbid="${m.imdbID}" data-bs-target="#movieDetailModal">View Details</button>
              </div>
            </div>
          </div>`;
}

const showModal = m => {
  return `<div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="movieDetailModalLabel">${m.Title} (${m.Released})</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-4">
                  <div class="card">
                    <img src="${m.Poster}" class="card-img-top">
                    <div class="card-body">
                      <p class="card-text">${m.Plot}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-8">
                  <ul class="list-group">
                    <li class="list-group-item"><strong>Duration : </strong> ${m.Runtime} </li>
                    <li class="list-group-item"><strong>Genre : </strong> ${m.Genre} </li>
                    <li class="list-group-item"><strong>Actors : </strong> ${m.Actors} </li>
                    <li class="list-group-item"><strong>Writer : </strong> ${m.Writer} </li>
                    <li class="list-group-item"><strong>Rating : </strong> ${m.imdbRating} </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>`;
}