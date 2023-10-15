const card_box = document.getElementById('card-box');
const card_box_avaliados = document.getElementById('card-box-avaliados');
const card_box_estreia = document.getElementById('card-box-estreias');
const card_box_vendidos = document.getElementById('card-box-vendidos');
const template_card = document.getElementById('template-card');


const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyODUzODg0NjU4NGUwMGJmNDJkZGNjNjUzNTNhNWZjNiIsInN1YiI6IjY1MWY0Y2EzNzQ1MDdkMDExYzEwNTY3MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NR8IyeayJlbiRqYDPdybtxroR3yc1eRTJhLRQ9zeLV0'
    }
  };

// HOME
fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-BR&page=1&sort_by=popularity.desc', options)
  .then(response => response.json())
  .then(response => {
      console.log('Home')
      console.log(response.results)

      for(let i = 0; i < 20; i++){
          const div = template_card.content.cloneNode(true);
          div.getElementById('imagem').src = "https://image.tmdb.org/t/p/w300"+response.results[i].poster_path;
          //div.getElementById('titulo').innerHTML = response.results[i].title;
          div.getElementById('botao').href = "paginas/filme.html?id="+response.results[i].id;
          card_box.append(div);
      }
      

  })
  .catch(err => console.error(err));


  //infos a mais
  /* fetch('https://api.themoviedb.org/3/movie/926393/images', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err)); */

// MAIS BEM AVALIADOS
busca('vote_count.desc', 'avaliados');


// MAIS VENDIDOS
busca('revenue.desc', 'vendidos')

// ESTREIAS
busca ('primary_release_date.desc', 'estreia');

function busca(link, aba){
  fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=pt-BR&page=1&sort_by='+link, options)
.then(response => response.json())
.then(response => {
    console.log('Próximos lançamentos')
    console.log(response.results)

    for(let i = 0; i < 18; i++){
        const div = template_card.content.cloneNode(true);
        if(response.results[i].poster_path != null){
        div.getElementById('imagem').src = "https://image.tmdb.org/t/p/w300"+response.results[i].poster_path;
        div.getElementById('botao').href = "filme.html?id="+response.results[i].id;

        switch (aba) {
          case 'vendidos':
            card_box_vendidos.append(div);
            break;
          case 'estreia':
            card_box_estreia.append(div);
            break;
          case 'avaliados':
            card_box_avaliados.append(div);
            break;
          case 'home':
            card_box.append(div);
            break;
        }
        
        }
      }
        

})
.catch(err => console.error(err));
}

//Pagina filme
const url = window.location.href;
let new_url = new URL (url);
let id = new_url.searchParams.get("id");
console.log(id);

fetch('https://api.themoviedb.org/3/movie/'+id, options)
.then(response => response.json())
.then(response => {
    console.log(response);
    
    document.getElementById('fundo').style = //"background-image: linear-gradient(217deg, rgb(182 168 168 / 100%), rgb(196 186 186 / 38%) 100%), url('https://image.tmdb.org/t/p/w500"+response.backdrop_path+"')";
    document.getElementById('titulo_filme').innerText = response.title;
    document.getElementById('imagem_filme').src = "https://image.tmdb.org/t/p/w300"+response.poster_path;
    document.getElementById('resumo_filme').innerText = "Sinopse: "+response.overview;
    document.getElementById('release').innerText = response.release_date+" ("+response.original_language+")";
    document.getElementById('average').innerText = "• Avaliação dos usuários: "+response.vote_average.toFixed(1)+"/10";
    document.getElementById('count').innerText = "• Quantidade de avaliações: "+response.vote_count;

    const options = {method: 'GET', headers: {accept: 'application/json'}};

  

})
//.catch(err => console.error(err));

fetch('https://api.themoviedb.org/3/movie/'+id+'/videos?language=en-US', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .then(response => console.log('trailer'))
/*   .then(response => {
    //if(response[0].key != false){
      document.getElementById('trailer').href = 'https://www.youtube.com/watch?v='+response['results'][0].key;
    //}
  }) */


  .then(response => {
    fetch('https://api.themoviedb.org/3/movie/'+id+'/videos?language=en-US')
  .then(response => response.json())
  .then(data => {
    /* let key = data.results.slice(-1)[0].key;
    let youtubeLink = `https://www.youtube.com/watch?v=${key}`;
    console.log(youtubeLink);
    document.getElementById('trailer').href = youtubeLink; */

    
    const key = data.results.slice(-1)[0].key;
    const youtubeLink = `https://www.youtube.com/watch?v=${key}`;
    // use youtubeLink as needed
    const officialTrailer = data.results.find(result => {
    const name = result.name.toLowerCase();
    return name.includes('official') && name.includes('trailer');
    });
    if (officialTrailer) {
      const officialTrailerKey = officialTrailer.key;
      const officialTrailerLink = `https://www.youtube.com/watch?v=${officialTrailerKey}`;
      document.getElementById('trailer').href = officialTrailerLink;
    }else{
      document.getElementById('trailer').remove();
    }
  
  })
})

  /* .then(data => {
    let officialTrailer = data.results.find(video => video.type === 'Official Trailer');
    if (officialTrailer) {
        let youtubeLink = 'https://www.youtube.com/watch?v=' + officialTrailer.key;
        console.log(youtubeLink);
        // Agora você pode usar o link do YouTube em seu HTML
        document.getElementById('trailer').href = youtubeLink;
    }
})
  .catch(error => console.error('Erro:', error));
  }) */