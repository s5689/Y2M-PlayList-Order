function script() {
  // Constantes de Argumentos.
  const NOMBRE = 'NOMBRE';
  const ARTISTA = 'ARTISTA';
  const ALBUM = 'ALBUM';
  const DURACION = 'DURACION';
  const DEFAULT = 'DEFAULT';

  const songsHtml = [];
  const songs = [];
  let listSize;
  let orderState = {
    nombre: false,
    artista: false,
    album: false,
    duracion: false,
    default: true,
  };

  getSize();
  if (!isNaN(listSize)) init();

  // Funciones del DOM
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

    const foundSong = songs.find((value) => value.id === e);

    $(songsHtml[e].children[7].children[2].children[0]).empty();

    if (!foundSong.selected) {
      $(songsHtml[e]).attr('is-checked', '""');
      $(songsHtml[e].children[7].children[2].children[0]).append(imgCheck);
    } else {
      $(songsHtml[e]).removeAttr('is-checked');
      $(songsHtml[e].children[7].children[2].children[0]).append(imgUnCheck);
    }

    foundSong.selected = !foundSong.selected;
  }

  function deseleccionar() {
    const foundSelected = [];
    songs.find((value) => {
      if (value.selected === true) seleccionar(value.id);
    });
  }

  function organizar(e) {
    order(e);

    $('#contents.ytmusic-playlist-shelf-renderer').empty();

    songs.forEach((value) => {
      $('#contents.ytmusic-playlist-shelf-renderer').append(
        songsHtml[value.id]
      );
    });
  }

  function order(e) {
    switch (e) {
      case NOMBRE: {
        orderState = {
          nombre: !orderState.nombre,
          artista: false,
          album: false,
          duracion: false,
          default: false,
        };

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
        orderState = {
          nombre: false,
          artista: !orderState.artista,
          album: false,
          duracion: false,
          default: false,
        };

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
        orderState = {
          nombre: false,
          artista: false,
          album: !orderState.album,
          duracion: false,
          default: false,
        };

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
        orderState = {
          nombre: false,
          artista: false,
          album: false,
          duracion: !orderState.duracion,
          default: false,
        };

        if (orderState.duracion)
          songs.sort((a, b) => {
            if (getA(a) > getB(b)) return 1;
            return -1;
          });
        else
          songs.sort((a, b) => {
            if (getA(a) > getB(b)) return -1;
            return 1;
          });

        function getA(a) {
          const posA = a.duracion.search(':');
          const minA = Number(a.duracion.substring(0, posA));
          const secA = Number(
            a.duracion.substring(posA + 1, a.duracion.length)
          );

          return minA * 60 + secA;
        }

        function getB(b) {
          const posB = b.duracion.search(':');
          const minB = Number(b.duracion.substring(0, posB));
          const secB = Number(
            b.duracion.substring(posB + 1, b.duracion.length)
          );

          return minB * 60 + secB;
        }

        break;
      }

      case DEFAULT: {
        orderState = {
          nombre: false,
          artista: false,
          album: false,
          duracion: false,
          default: !orderState.default,
        };

        if (orderState.default)
          songs.sort((a, b) => {
            if (a.id > b.id) return 1;
            return -1;
          });
        else
          songs.sort((a, b) => {
            if (a.id > b.id) return -1;
            return 1;
          });

        break;
      }
    }
  }

  // Detectar cuando aparezca interfaz de seleccion
  document.addEventListener('DOMSubtreeModified', async (e) => {
    try {
      if (typeof $(e.target).attr('menu-text') !== 'undefined') {
        await sleep(10);
        interfaceInjection();
      }

      if ($(e.target)[0].localName === 'tp-yt-paper-listbox') {
        if (typeof $(e.target)[0].children[2] !== 'undefined') {
          await sleep(10);
          interfaceInjection();
        }
      }
    } catch (error) {}
  });

  // Inyectar funciones dentro de la interfaz de Seleccion cada vez que aparezca
  function interfaceInjection() {
    const injection = {
      onclick: 'deseleccionar()',
      style: 'border: 1px solid dimgrey; border-radius: 30px;',
    };

    const menuInjection = {
      onclick: 'deseleccionar()',
      style: 'border-left: 1px solid white;',
    };

    $(
      $('ytmusic-dialog').find('#icon.style-scope.tp-yt-paper-icon-button')[0]
    ).attr(injection);

    $($('button#button')[1]).attr(injection);
    $($('tp-yt-paper-listbox')[0].children[2]).attr(menuInjection);
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
    let tempHtml = [];

    // Scroll hasta que las canciones encontradas sean del tamaño de la lista.
    const scrollingElement = document.scrollingElement || document.body;

    while (tempHtml.length !== listSize) {
      scrollingElement.scrollTop = scrollingElement.scrollHeight;

      tempHtml = document.getElementsByTagName(
        'ytmusic-responsive-list-item-renderer'
      );

      await sleep(500);
    }

    // Subir Scroll
    scrollingElement.scrollTop = 0;

    // Seleccionar y Deseleccionar la primera cancion de la lista para generar los div de Seleccion
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

    document
      .querySelector('#header')
      .insertAdjacentHTML(
        'beforeend',
        `<button onclick="organizar(${DEFAULT})">Por defecto</button>`
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

$(() => {
  $('head').append(`<script>${main}</script>`);
});
