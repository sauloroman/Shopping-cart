// ################################
// SELECTORES Y VARIABLES
// ################################

const btnsAbrirCerrarPanel = document.querySelectorAll('.btnPanel');
const panelDeCobro = document.querySelector('#panel');
const listaPanel = document.querySelector('#product-item__list');
const btnBorrarTodo = document.querySelector('.delete-all');
const precioTotal = document.querySelector('.product__total');
const galleryEl = document.querySelector('.gallery'); 
const year = document.getElementById('year');
let articulos = [];

// ################################
// EVENT LISTENERS
// ################################

function eventListeners() {

  // Evento para abrir y cerrar el panel de cobro
  btnsAbrirCerrarPanel.forEach( btn => {
    btn.addEventListener('click', () => panelDeCobro.classList.toggle('show') );
  });

  // Evento para identificar el articulo
  galleryEl.addEventListener('click', agregarArticulo );

  // Evento para eliminar un articulo del carrito
  listaPanel.addEventListener('click', eliminarArticulo );

  // Eliminar todos los productos del carrito
  btnBorrarTodo.addEventListener('click', e => {
    e.preventDefault();
    articulos = [];
    articulosEnCarritoHTML();
  });

  // Colocar los articulos de la ultima vez que se uso y colocar el año actual
  document.addEventListener('DOMContentLoaded', () => {
    year.textContent = new Date().getFullYear();
    articulos = JSON.parse(localStorage.getItem('articulos')) || [];
    articulosEnCarritoHTML();
  });

}
eventListeners();

// ################################
// FUNCIONES
// ################################

// Identifica el articulo a agregar al carrito y verifica que se seleccione una cantidad
function agregarArticulo( e ) {

  if ( e.target.classList.contains('agregar') ) {

    const articuloSeleccionado = e.target.parentElement.parentElement.parentElement;
    
    const cantidad = articuloSeleccionado.querySelector('input').value;

    if ( !cantidad ) {
      mostrarAlerta('Choose amount', 'error');
    } else {
      informacionArticulo( articuloSeleccionado );
    }
  }
}

// Elimina el articulo seleccionado del HTML y del arreglo
function eliminarArticulo( e ) {

  if ( e.target.classList.contains('product-item__icon') ) {
    
    const articuloAEliminar = e.target.parentElement.getAttribute('data-id');
    articulos = articulos.filter( articulo => articulo.id !== articuloAEliminar );
    articulosEnCarritoHTML();
  }

}

// Esta función extrae la información del usuario y valida que no exista previamente el articulo en el carrito
function informacionArticulo( articulo ) {

  const informacion = {
    imagen: articulo.querySelector('img').src,
    nombre: articulo.querySelector('.gallery__title').textContent,
    precio: articulo.querySelector('.gallery__price span').textContent,
    id: articulo.querySelector('i').getAttribute('data-id'),
    cantidad: articulo.querySelector('input').value
  }

  // Limpia el campo de cantidad del articulo
  articulo.querySelector('input').value = '';

  const existencia = articulos.some( articulo => articulo.id === informacion.id );
  
  if ( existencia ) {
    mostrarAlerta('It\'s already in card', 'existente');
  } else {
    mostrarAlerta('New item added', 'nuevo');
    articulos = [...articulos, informacion ];
  }

  articulosEnCarritoHTML();

}

// Crea lo articulos en el carrito con la información de cada uno de estosw
function articulosEnCarritoHTML() {

  limpiar(listaPanel);

  articulos.forEach( articulo => {

    const {imagen, nombre, precio, id, cantidad} = articulo;

    const li = document.createElement('LI');
    li.classList.add('product-item__li');
  
    li.innerHTML = `
      <figure>
        <img src="${imagen}" alt="Producto" class="product-item__img"/>
      </figure>

      <div class="product-item__info">
        <p class="product-item__title">${nombre}</p>
        <p class="product-item__price">$${precio}</p>
        <p class="product-item__amount">Amount: <span>${cantidad}</span></p>
      </div>

      <div class="product-itemBox__icons" data-id="${id}">
        <i class='bx bx-trash product-item__icon'></i>
      </div>
    `;
  
    listaPanel.appendChild( li );

  });

  calcularTotal();

  colocarEnLocalStorage();

}

// Guardad en la sesión local del navegador
function colocarEnLocalStorage() {
  localStorage.setItem('articulos', JSON.stringify(articulos) );
}

// Calcula el total almacenado de los articulos en el carrito
function calcularTotal() {

  limpiar(precioTotal);

  let suma = 0;
  articulos.forEach( articulo => {
    const { cantidad, precio } = articulo;
    suma += Number(cantidad) * Number(precio);
  });

  const p = document.createElement('P');
  p.classList.add('panel__total');

  p.innerHTML = ` Total: <span>$${suma.toFixed(2)}</span>`

  precioTotal.appendChild( p );
}

// Antes de crear se debe de limpiar, esta función se encarga de limpiar los contenedores en donde se va a crear contenido
function limpiar( contenedor ) {
  while ( contenedor.firstElementChild ) {
    contenedor.removeChild( contenedor.firstElementChild );
  }
}


// Función para mostrar alertas en pantalla
function mostrarAlerta( mensaje, tipo ) {

  const contenedorDeAlertas = document.querySelector('.alerta');
  contenedorDeAlertas.classList.add('alerta__active');

  if ( tipo === 'nuevo' ) {
    contenedorDeAlertas.classList.add('nuevo');
  } else if ( tipo === 'existente' ) {
    contenedorDeAlertas.classList.add('existente');
  } else {
    contenedorDeAlertas.classList.add('error');
  }

  contenedorDeAlertas.innerHTML = `
    <p>${mensaje}</p>
    <i class='bx bx-bell-minus alert__icono'></i>
  `;

  setTimeout( () => {
    contenedorDeAlertas.classList.remove('alerta__active');
    contenedorDeAlertas.classList.remove('nuevo');
    contenedorDeAlertas.classList.remove('existente');
    contenedorDeAlertas.classList.remove('error');
  }, 2000 );

}
