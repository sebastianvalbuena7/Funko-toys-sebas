// Variables
const carrito = document.querySelector('#carrito')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')
const listaFunkos = document.querySelector('#lista-funkos')
const btn = document.getElementsByClassName('agregar-carrito')
const btnFinCompra = document.getElementById('finalizar-compra')

// Arreglo para agregar cada artículo
let articulosCarrito = []

// EventListeners
cargarEventListeners()

function cargarEventListeners() {
    listaFunkos.addEventListener('click', agregarFunko)
    carrito.addEventListener('click', eliminarFunko)

    // Muestra los funkos de localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carritoFunkos')) || []
        Mostrarcarrito()
    })
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito)
    btnFinCompra.addEventListener('click', finalizarCompra)
}

// Uso de Toastify
for(let i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', () => {
        Toastify({
            text: "Funko agregado al carrito",
            duration: 3000,
            destination: "",
            newWindow: false,
            close: true,
            gravity: "top",
            position: "left", 
            stopOnFocus: true, 
            style: {
              background: "linear-gradient(to right, #240b36, #c31432)",
            },
          }).showToast();
    })
}

// Funciones
// Función que toma los datos del funko para agregarlo al carrito
function agregarFunko(e) {
    e.preventDefault()
    if(e.target.classList.contains('agregar-carrito')) {
        const funko = e.target.parentElement.parentElement
        leerDatosFunko(funko)
    }
}

// Lee los datos del funko
function leerDatosFunko(funko) {
    const infoFunkos = {
        imagen: funko.querySelector('img').src,
        nombre: funko.querySelector('p').textContent,
        precio: funko.querySelector('.precio span').textContent,
        id: funko.querySelector('a').getAttribute('data-id'), 
        cantidad: 1
    }
    if(articulosCarrito.some (funko => funko.id === infoFunkos.id)) {
        const funkos = articulosCarrito.map(funko => {
            if(funko.id === infoFunkos.id) {
                funko.cantidad++
                return funko
            } else {
                return funko 
            }
        })

        articulosCarrito = [...funkos]
    } else {
        articulosCarrito = [ ...articulosCarrito ,infoFunkos]
    }
    Mostrarcarrito()
}

// Eliminar el funko del carrito
function eliminarFunko (e) {
    e.preventDefault()
    if(e.target.classList.contains('borrar-funko')) {
        const funkoId = e.target.getAttribute('data-id')
        articulosCarrito = articulosCarrito.filter(funko => funko.id !== funkoId)
        Mostrarcarrito()
    }
}

// Muestra los datos del funko y los inytecta en el HTML
function Mostrarcarrito() {
    vaciarCarrito()
    articulosCarrito.forEach(funko => {
        const {imagen, nombre, precio, cantidad, id} = funko
        const contenido = document.createElement('tr')
        contenido.innerHTML = `<td> <img src='${imagen}'> </td>
        <td>${nombre}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td> <a href='#' class='borrar-funko' data-id='${id}'> X </a> </td> `
        contenedorCarrito.appendChild(contenido)
    })
    sincronizarStorage()
}

// Alerta con Sweet Alert
function finalizarCompra() {
    if(articulosCarrito.some (funko => funko.id !== 0)) { 
        Swal.fire({
            title: 'Perfecto!',
            text: 'Tu compra ha finalizado',
            icon: 'success',
            confirmButtonText: 'Finalizar'
          })
        while(contenedorCarrito.firstChild) {
            contenedorCarrito.removeChild(contenedorCarrito.firstChild)
        }
    } else {
        Swal.fire({
            title: 'No añadiste nada al carrito',
            text: 'Añade algo a tu carrito',
            icon: 'error',
            confirmButtonText: 'Comprar'
          })
    }
}

// Vaciar el carrito
function vaciarCarrito() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

// Función para sincronizar el LocalStorage
function sincronizarStorage() {
    localStorage.setItem('carritoFunkos', JSON.stringify(articulosCarrito))
}