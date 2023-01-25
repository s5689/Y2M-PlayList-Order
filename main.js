function script() {
  // Obtener cantidad de canciones desde el total de canciones.
  const listSize = Number(
    document
      .getElementsByClassName(
        'second-subtitle style-scope ytmusic-detail-header-renderer'
      )[0]
      .innerHTML.replace(' canciones', '')
  );

  // Constantes de Argumentos.
  const NOMBRE = 'NOMBRE';
  const ARTISTA = 'ARTISTA';
  const ALBUM = 'ALBUM';
  const DURACION = 'DURACION';

  const songsHtml = [];
  const songs = [];
  let orderState = {
    nombre: false,
    artista: false,
    album: false,
    duracion: false,
  };

  init();

  function organizar(e) {
    order(e);

    $('.style-scope ytmusic-playlist-shelf-renderer').empty();

    songs.forEach((value) => {
      $('.style-scope ytmusic-playlist-shelf-renderer').append(
        songsHtml[value.id]
      );
    });

    /*
    console.log(orderState);
    console.log(songs[0]);
    */
  }

  function order(e) {
    switch (e) {
      case NOMBRE: {
        orderState.nombre = !orderState.nombre;

        if (orderState.nombre)
          songs.sort((a, b) => {
            if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return 1;
            return -1;
          });
        else
          songs.sort((a, b) => {
            if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return -1;
            return 1;
          });

        break;
      }

      case ARTISTA: {
        orderState.artista = !orderState.artista;

        if (orderState.artista)
          songs.sort((a, b) => {
            if (a.artista.toLowerCase() > b.artista.toLowerCase()) return 1;
            return -1;
          });
        else
          songs.sort((a, b) => {
            if (a.artista.toLowerCase() > b.artista.toLowerCase()) return -1;
            return 1;
          });

        break;
      }

      case ALBUM: {
        orderState.album = !orderState.album;

        if (orderState.album)
          songs.sort((a, b) => {
            if (a.album.toLowerCase() > b.album.toLowerCase()) return 1;
            return -1;
          });
        else
          songs.sort((a, b) => {
            if (a.album.toLowerCase() > b.album.toLowerCase()) return -1;
            return 1;
          });

        break;
      }

      case DURACION: {
        orderState.duracion = !orderState.duracion;

        if (orderState.duracion)
          songs.sort((a, b) => {
            if (a.duracion.toLowerCase() > b.duracion.toLowerCase()) return 1;
            return -1;
          });
        else
          songs.sort((a, b) => {
            if (a.duracion.toLowerCase() > b.duracion.toLowerCase()) return -1;
            return 1;
          });

        break;
      }
    }
  }

  async function init() {
    let tempHtml = null;

    // Scroll hasta que las canciones encontradas sean del tamaño de la lista.
    const scrollingElement = document.scrollingElement || document.body;

    do {
      scrollingElement.scrollTop = scrollingElement.scrollHeight;

      tempHtml = document.getElementsByTagName(
        'ytmusic-responsive-list-item-renderer'
      );

      await sleep(3000);
    } while (tempHtml.length !== listSize);

    scrollingElement.scrollTop = 0;

    // Generar JSON con canciones armadas con sus id's.
    for (let k = 0; k < listSize; k++) {
      tempHtml[k].id = `n${k}`;

      songsHtml.push(tempHtml[k]);

      songs.push({
        id: k,
        nombre: tempHtml[k].children[4].children[0].children[0].innerText,
        artista: tempHtml[k].children[4].children[2].children[0].innerText,
        album: tempHtml[k].children[4].children[2].children[1].innerText,
        duracion: tempHtml[k].children[6].children[0].innerText,
      });
    }

    // Generar Botones & Info
    document
      .querySelector('#header')
      .insertAdjacentHTML(
        'beforeend',
        `<h1 style="display: inline; margin: 0 5rem 0 6vw;">Cargadas ${listSize} canciones.</h1>`
      );

    document
      .querySelector('#header')
      .insertAdjacentHTML(
        'beforeend',
        `<button onclick="organizar(${NOMBRE})">Por Nombre</button>`
      );

    document
      .querySelector('#header')
      .insertAdjacentHTML(
        'beforeend',
        `<button onclick="organizar(${ARTISTA})">Por Artista</button>`
      );

    document
      .querySelector('#header')
      .insertAdjacentHTML(
        'beforeend',
        `<button onclick="organizar(${ALBUM})">Por Album</button>`
      );

    document
      .querySelector('#header')
      .insertAdjacentHTML(
        'beforeend',
        `<button onclick="organizar(${DURACION})">Por Duracion</button>`
      );
  }

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const main = script.toString().replace('function script() {', '').slice(0, -1);

$('head').append(
  '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>'
);

$('head').append(`<script>${main}</script>`);
