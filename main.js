function script() {
  // Constantes de Argumentos.
  const NOMBRE = 'NOMBRE';
  const ARTISTA = 'ARTISTA';
  const ALBUM = 'ALBUM';
  const DURACION = 'DURACION';

  const songsHtml = [];
  const songs = [];
  let listSize;
  let orderState = {
    nombre: false,
    artista: false,
    album: false,
    duracion: false,
  };

  getSize();
  if (!isNaN(listSize)) init();

  function organizar(e) {
    order(e);

    $('#contents.ytmusic-playlist-shelf-renderer').empty();

    songs.forEach((value) => {
      $('#contents.ytmusic-playlist-shelf-renderer').append(
        songsHtml[value.id]
      );
    });
  }

  function seleccionar(e) {
    const imgCheck = `
    <svg 
      viewBox="0 0 24 24" 
      preserveAspectRatio="xMidYMid meet" 
      focusable="false" 
      class="style-scope yt-icon" 
      style="pointer-events: none; display: block; width: 100%; height: 100%;">
        <g class="style-scope yt-icon">
          <path d="M3 3V21H21V3H3ZM9.65 17L5.85 13.2L7.26 11.79L9.64 14.17L16.73 7.08L18.14 8.49L9.65 17Z" class="style-scope yt-icon"></path>
        </g>
    </svg>`;

    const imgUnCheck = `
    <svg
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      class="style-scope yt-icon" 
      style="pointer-events: none; display: block; width: 100%; height: 100%;">
        <g class="style-scope yt-icon">
          <path d="M3 3V21H21V3H3ZM20 20H4V4H20V20Z" class="style-scope yt-icon"></path>
        </g>
    </svg>`;

    $(songsHtml[e].children[7].children[2].children[0]).empty();

    if (!songs[e].selected) {
      $(songsHtml[e]).attr('is-checked', '""');
      $(songsHtml[e].children[7].children[2].children[0]).append(imgCheck);
    } else {
      $(songsHtml[e]).removeAttr('is-checked');
      $(songsHtml[e].children[7].children[2].children[0]).append(imgUnCheck);
    }

    songs[e].selected = !songs[e].selected;
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

  // Obtener cantidad de canciones desde el total de canciones, de existir.
  function getSize() {
    listSize = Number(
      document
        .querySelector(
          '.second-subtitle.style-scope.ytmusic-detail-header-renderer'
        )
        .innerHTML.replace(' canciones', '')
    );

    if (isNaN(listSize))
      listSize = Number(
        document
          .querySelector(
            '.second-subtitle.style-scope.ytmusic-detail-header-renderer'
          )
          .children[0].innerHTML.replace(' canciones', '')
      );
  }

  // Inicializar extension si existe numero total de canciones.
  async function init() {
    let tempHtml = null;

    // Scroll hasta que las canciones encontradas sean del tamaño de la lista.
    const scrollingElement = document.scrollingElement || document.body;

    do {
      scrollingElement.scrollTop = scrollingElement.scrollHeight;

      tempHtml = document.getElementsByTagName(
        'ytmusic-responsive-list-item-renderer'
      );

      await sleep(2500);
    } while (tempHtml.length !== listSize);

    scrollingElement.scrollTop = 0;

    $(tempHtml[0].children[6].children[2].children[0]).click();
    await sleep(1200);
    $(tempHtml[0].children[7].children[2].children[0]).click();

    // Generar JSON con canciones armadas con sus id's.
    for (let k = 0; k < listSize; k++) {
      // Preparar DOM para las selecciones
      tempHtml[k].id = `n${k}`;
      $(tempHtml[k].children[1]).attr('onclick', `seleccionar(${k})`);
      $(tempHtml[k].children[7].children[2].children[0]).attr(
        'onclick',
        `seleccionar(${k})`
      );

      songsHtml.push(tempHtml[k]);

      songs.push({
        id: k,
        nombre: tempHtml[k].children[5].children[0].children[0].innerText,
        artista: tempHtml[k].children[5].children[2].children[0].innerText,
        album: tempHtml[k].children[5].children[2].children[1].innerText,
        duracion: tempHtml[k].children[7].children[0].innerText,
        selected: false,
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
